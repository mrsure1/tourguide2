import re
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# 이 함수는 사용자가 입력한 문장과 FAQ 질문 문장을 검색하기 좋은 형태로 정리합니다.
# 소문자 변환, 특수문자 제거, 공백 정리 등을 통해 같은 의미의 문장이 조금 다르게 입력되어도 비교가 쉬워지도록 만듭니다.
def preprocess_text(text):
    normalized_text = str(text).lower().strip()
    normalized_text = re.sub(r"[^0-9a-zA-Z가-힣\s]", " ", normalized_text)
    normalized_text = re.sub(r"\s+", " ", normalized_text)
    return normalized_text


# 이 함수는 한국어 문장을 단어 단위로 잘게 나누는 간단한 토큰화 역할을 합니다.
# 전문 형태소 분석기만큼 복잡하진 않지만, 조사와 어미 일부를 정리해 핵심 단어를 비교하기 쉽게 도와줍니다.
def tokenize_korean_text(text):
    cleaned_text = preprocess_text(text)
    raw_tokens = re.findall(r"[0-9a-zA-Z가-힣]+", cleaned_text)

    suffixes = (
        "입니다",
        "합니다",
        "해요",
        "해도",
        "되나요",
        "되죠",
        "인가요",
        "있어요",
        "없어요",
        "세요",
        "까요",
        "나요",
        "군요",
        "이라",
        "라서",
        "에게",
        "에서",
        "으로",
        "부터",
        "까지",
        "처럼",
        "라도",
        "보다",
        "이고",
        "이며",
        "이면",
        "이라",
        "에서",
        "에게",
        "한테",
        "으로",
        "로",
        "은",
        "는",
        "이",
        "가",
        "을",
        "를",
        "에",
        "도",
        "만",
        "와",
        "과",
        "요",
    )

    processed_tokens = []
    for token in raw_tokens:
        stripped_token = token
        for suffix in suffixes:
            if stripped_token.endswith(suffix) and len(stripped_token) > len(suffix) + 1:
                stripped_token = stripped_token[: -len(suffix)]
                break

        if len(stripped_token) >= 2:
            processed_tokens.append(stripped_token)

            # 한국어 질문은 띄어쓰기 차이의 영향을 줄이기 위해 문자 2-gram도 일부 함께 추가합니다.
            if re.search(r"[가-힣]", stripped_token) and len(stripped_token) >= 3:
                processed_tokens.extend(
                    stripped_token[index : index + 2]
                    for index in range(len(stripped_token) - 1)
                )

    return processed_tokens


# 이 함수는 faq_data.csv 파일을 읽고, 비어 있는 값이 없는지 점검한 뒤 데이터프레임으로 반환합니다.
# 챗봇이 참고하는 지식 사전 역할을 하는 단계입니다.
def load_faq_data(csv_path):
    faq_df = pd.read_csv(csv_path)
    faq_df = faq_df[["Question", "Answer"]].dropna().reset_index(drop=True)

    if faq_df.empty:
        raise ValueError("FAQ 데이터가 비어 있습니다. faq_data.csv 내용을 확인해 주세요.")

    return faq_df


# 이 함수는 FAQ 질문 목록을 TF-IDF 숫자 벡터로 변환할 준비를 합니다.
# 쉽게 말해, 사람이 읽는 문장을 컴퓨터가 비교할 수 있는 숫자 표로 바꾸는 과정입니다.
def build_vectorizer_and_matrix(questions):
    vectorizer = TfidfVectorizer(
        tokenizer=tokenize_korean_text,
        token_pattern=None,
        lowercase=False,
    )
    question_matrix = vectorizer.fit_transform(questions)
    return vectorizer, question_matrix


# 이 함수는 FAQ CSV를 읽고 챗봇 검색에 필요한 모든 준비를 한 번에 끝냅니다.
# 웹 화면, 콘솔 화면처럼 여러 실행 방식에서 같은 초기화 코드를 반복하지 않도록 도와줍니다.
def initialize_chatbot_engine(csv_path="faq_data.csv"):
    faq_df = load_faq_data(csv_path)
    vectorizer, question_matrix = build_vectorizer_and_matrix(faq_df["Question"].tolist())
    return faq_df, vectorizer, question_matrix


# 이 함수는 사용자의 질문과 FAQ 질문들 사이의 유사도를 계산해
# 가장 비슷한 질문의 인덱스와 점수를 반환합니다.
def find_best_match(user_question, vectorizer, question_matrix):
    user_vector = vectorizer.transform([user_question])
    similarity_scores = cosine_similarity(user_vector, question_matrix).flatten()

    best_match_index = similarity_scores.argmax()
    best_match_score = float(similarity_scores[best_match_index])
    return best_match_index, best_match_score


# 이 함수는 사용자의 질문과 가장 비슷한 FAQ 후보 여러 개를 유사도 순으로 반환합니다.
# 웹 화면에서 "비슷한 질문 더 보기" 기능을 만들 때 활용할 수 있습니다.
def find_top_matches(user_question, faq_df, vectorizer, question_matrix, top_k=3):
    user_vector = vectorizer.transform([user_question])
    similarity_scores = cosine_similarity(user_vector, question_matrix).flatten()

    sorted_indices = similarity_scores.argsort()[::-1][:top_k]
    top_matches = []
    for index in sorted_indices:
        top_matches.append(
            {
                "question": faq_df.loc[index, "Question"],
                "answer": faq_df.loc[index, "Answer"],
                "similarity_score": float(similarity_scores[index]),
            }
        )

    return top_matches


# 이 함수는 실제 챗봇 답변을 만드는 핵심 함수입니다.
# 가장 유사한 FAQ를 찾고, 유사도가 기준보다 낮으면 안내 문구를 반환합니다.
def get_chatbot_response(user_question, faq_df, vectorizer, question_matrix, threshold=0.2):
    top_matches = find_top_matches(
        user_question=user_question,
        faq_df=faq_df,
        vectorizer=vectorizer,
        question_matrix=question_matrix,
        top_k=3,
    )
    best_match_index, best_match_score = find_best_match(
        user_question=user_question,
        vectorizer=vectorizer,
        question_matrix=question_matrix,
    )

    if best_match_score < threshold:
        return {
            "matched_question": None,
            "similarity_score": best_match_score,
            "top_matches": top_matches,
            "answer": "죄송합니다. 해당 내용은 고객센터(1588-0000)로 문의해 주시거나 다른 검색어를 입력해 주세요.",
        }

    return {
        "matched_question": faq_df.loc[best_match_index, "Question"],
        "similarity_score": best_match_score,
        "top_matches": top_matches,
        "answer": faq_df.loc[best_match_index, "Answer"],
    }


# 이 함수는 프로그램을 실행했을 때 사용자가 직접 질문을 입력하고 답변을 받도록 만드는 대화 루프입니다.
# exit, quit, 종료 중 하나를 입력하면 프로그램을 끝냅니다.
def run_chatbot():
    csv_path = Path("faq_data.csv")
    if not csv_path.exists():
        raise FileNotFoundError(
            "faq_data.csv 파일이 없습니다. 먼저 create_faq_data.py를 실행해 FAQ 데이터를 생성해 주세요."
        )

    faq_df, vectorizer, question_matrix = initialize_chatbot_engine(csv_path)

    print("가이드매칭 Support FAQ 챗봇입니다.")
    print("질문을 입력해 주세요. 종료하려면 'exit', 'quit', '종료' 중 하나를 입력하세요.\n")

    while True:
        user_question = input("사용자 질문: ").strip()

        if user_question.lower() in {"exit", "quit", "종료"}:
            print("챗봇을 종료합니다.")
            break

        if not user_question:
            print("질문이 비어 있습니다. 내용을 입력해 주세요.\n")
            continue

        response = get_chatbot_response(
            user_question=user_question,
            faq_df=faq_df,
            vectorizer=vectorizer,
            question_matrix=question_matrix,
        )

        if response["matched_question"] is not None:
            print(f"가장 유사한 질문: {response['matched_question']}")
            print(f"유사도 점수: {response['similarity_score']:.3f}")
        else:
            print(f"유사도 점수: {response['similarity_score']:.3f}")

        print(f"챗봇 답변: {response['answer']}\n")


if __name__ == "__main__":
    run_chatbot()
