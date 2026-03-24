from __future__ import annotations

import base64
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import streamlit as st  # pyright: ignore[reportMissingImports]

from faq_chatbot import get_chatbot_response, initialize_chatbot_engine


WORKSPACE_DIR = Path(__file__).resolve().parent
LOG_DIR = WORKSPACE_DIR / "chat_logs"
LOG_FILE = LOG_DIR / "guidematch_chat_log.jsonl"
ASSETS_DIR = WORKSPACE_DIR / "assets"
COMPANY_LOGO_PATH = ASSETS_DIR / "company_logo.png"
CHAT_ICON_PATH = ASSETS_DIR / "chat_icon.png"
EMBED_AVATAR_CACHE = WORKSPACE_DIR / "_embed_assistant_avatar.png"


# 이 함수는 이미지 파일을 base64 문자열로 바꿔 CSS 배경 이미지나 HTML img 태그에 넣기 쉽게 만듭니다.
# 아이콘 런처와 회사 로고를 외부 링크 없이 안정적으로 화면에 표시하기 위해 사용합니다.
def encode_image_base64(image_path):
    if not image_path.exists():
        return ""
    return base64.b64encode(image_path.read_bytes()).decode("utf-8")


def is_embed_mode() -> bool:
    """Next.js iframe에서 ?embed=1 로 열릴 때: 플로팅 런처·중복 껍데기 없이 본문만 표시."""
    raw = st.query_params.get("embed", "")
    if isinstance(raw, list):
        raw = raw[0] if raw else ""
    return str(raw).strip().lower() in ("1", "true", "yes")


def assistant_avatar_path_from_icon(icon_base64: str) -> Optional[str]:
    """st.chat_message(avatar=...)용 로컬 파일 경로. 기존 chat_icon.png와 동일 자산 사용."""
    if not icon_base64:
        return None
    try:
        EMBED_AVATAR_CACHE.write_bytes(base64.b64decode(icon_base64))
        return str(EMBED_AVATAR_CACHE.resolve())
    except (OSError, ValueError):
        return None


# 이 함수는 현재 로그인 사용자의 아이디를 Streamlit 쿼리 파라미터에서 가져옵니다.
# 실제 사이트 연동 시 `?user_id=...` 형태로 넘겨 주면, 대화 로그에 누가 문의했는지 함께 남길 수 있습니다.
def get_logged_in_user_id():
    user_id = st.query_params.get("user_id", "")
    if isinstance(user_id, list):
        user_id = user_id[0] if user_id else ""
    return str(user_id).strip() or "anonymous"


# 이 함수는 챗봇 사용 기록을 JSON Lines 파일에 한 줄씩 저장합니다.
# 사용자 아이디, 세션 아이디, 이벤트 종류, 질문/답변 등을 남겨서 서버 로그처럼 추적할 수 있게 합니다.
def log_chat_event(event_type, payload):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "user_id": get_logged_in_user_id(),
        "session_id": st.session_state.get("session_id"),
        **payload,
    }
    with LOG_FILE.open("a", encoding="utf-8") as log_file:
        log_file.write(json.dumps(record, ensure_ascii=False) + "\n")


def apply_embed_styles():
    """iframe 전용: 앱형 UI, 하단 입력 도크 고정."""
    st.markdown(
        r"""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

        html, body, [data-testid="stAppViewContainer"], .stApp {
            background: linear-gradient(165deg, #f8fafc 0%, #f1f5f9 48%, #eef2ff 100%) !important;
            font-family: 'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif;
        }

        #MainMenu, header[data-testid="stHeader"], footer { visibility: hidden !important; height: 0 !important; min-height: 0 !important; }

        .block-container {
            max-width: 100% !important;
            padding: 0.65rem 0.7rem 5.5rem 0.7rem !important;
        }

        /* 상단 앱 바 */
        div[data-testid="column"] .embed-app-icon {
            width: 42px; height: 42px; border-radius: 14px; object-fit: cover;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
        .embed-app-icon-fallback {
            width: 42px; height: 42px; border-radius: 14px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white; font-weight: 800; font-size: 1.1rem;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
        }
        .embed-app-titles .t1 {
            display: block; font-size: 0.95rem; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;
        }
        .embed-app-titles .t2 {
            display: block; font-size: 0.72rem; color: #64748b; margin-top: 0.12rem;
        }

        .embed-intro {
            color: #64748b;
            font-size: 0.8rem;
            margin: 0.35rem 0 0.55rem 0;
            line-height: 1.55;
        }

        .quick-question-title {
            color: #94a3b8;
            font-size: 0.68rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 0.15rem 0 0.4rem 0;
        }

        .quick-row {
            display: flex;
            flex-wrap: nowrap;
            gap: 0.45rem;
            overflow-x: auto;
            padding-bottom: 0.35rem;
            margin-bottom: 0.5rem;
            scrollbar-width: thin;
        }
        .quick-row::-webkit-scrollbar { height: 4px; }
        .quick-row::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        .quick-row .stButton { flex: 0 0 auto; }
        .quick-row .stButton > button {
            border-radius: 999px !important;
            border: 1px solid #e2e8f0 !important;
            background: rgba(255,255,255,0.9) !important;
            backdrop-filter: blur(8px);
            color: #334155 !important;
            font-size: 0.78rem !important;
            font-weight: 600 !important;
            min-height: 2.1rem !important;
            padding: 0.3rem 0.85rem !important;
            white-space: nowrap !important;
        }
        .quick-row .stButton > button:hover {
            border-color: #c7d2fe !important;
            background: white !important;
            color: #4f46e5 !important;
        }

        .chat-scroll-box {
            max-height: calc(100vh - 15.5rem);
            overflow-y: auto;
            padding-right: 0.2rem;
            margin-bottom: 0.25rem;
        }

        div[data-testid="stChatMessage"] {
            padding: 0.35rem 0;
            background: transparent;
        }
        div[data-testid="stChatMessageContent"] { padding: 0; background: transparent; }
        div[data-testid="stChatMessage"] [data-testid="stMarkdownContainer"] p {
            line-height: 1.58;
            font-size: 0.84rem;
            margin: 0;
        }

        div[data-testid="stChatMessage"]:has(div[data-testid="chatAvatarIcon-user"]) div[data-testid="stMarkdownContainer"] {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: white;
            border-radius: 18px 18px 6px 18px;
            padding: 0.68rem 0.9rem;
            box-shadow: 0 10px 28px rgba(79, 70, 229, 0.22);
        }
        div[data-testid="stChatMessage"]:has(div[data-testid="chatAvatarIcon-assistant"]) div[data-testid="stMarkdownContainer"] {
            background: rgba(255,255,255,0.92);
            color: #0f172a;
            border: 1px solid rgba(226, 232, 240, 0.9);
            border-radius: 18px 18px 18px 6px;
            padding: 0.68rem 0.9rem;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
            backdrop-filter: blur(10px);
        }

        .faq-inline-wrap { margin: 0.4rem 0 0.25rem 0; }
        .faq-inline-wrap .stButton > button {
            width: 100%;
            text-align: left !important;
            justify-content: flex-start !important;
            border-radius: 14px !important;
            font-size: 0.76rem !important;
            font-weight: 600 !important;
            border: 1px solid #e2e8f0 !important;
            background: rgba(255,255,255,0.95) !important;
            color: #334155 !important;
        }
        .faq-inline-answer {
            margin: 0.2rem 0 0.45rem 0;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 0.62rem 0.78rem;
            color: #334155;
            font-size: 0.78rem;
            line-height: 1.58;
        }

        /* 하단 고정 입력 도크 */
        div[data-testid="stForm"] {
            position: fixed !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: 1000 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            padding: 0.55rem 0.65rem calc(0.55rem + env(safe-area-inset-bottom, 0px)) 0.65rem !important;
            background: rgba(255, 255, 255, 0.82) !important;
            backdrop-filter: blur(16px) saturate(1.2);
            -webkit-backdrop-filter: blur(16px) saturate(1.2);
            border-top: 1px solid rgba(226, 232, 240, 0.85) !important;
            box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.08) !important;
        }
        div[data-testid="stForm"] [data-testid="column"] {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        div[data-testid="stForm"] .stTextInput > div > div > input {
            border-radius: 999px !important;
            border: 1px solid #e2e8f0 !important;
            min-height: 2.65rem !important;
            font-size: 0.86rem !important;
            background: white !important;
            padding-left: 1rem !important;
        }
        div[data-testid="stForm"] .stTextInput > div > div > input:focus {
            border-color: #a5b4fc !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
        }

        div[data-testid="stFormSubmitButton"] > button {
            border-radius: 999px !important;
            min-height: 2.65rem !important;
            min-width: 2.65rem !important;
            width: 2.65rem !important;
            padding: 0 !important;
            border: none !important;
            background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
            color: white !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35) !important;
        }
        div[data-testid="stFormSubmitButton"] > button:hover {
            background: linear-gradient(135deg, #4338ca, #4f46e5) !important;
        }

        .embed-dock-foot {
            text-align: center;
            color: #94a3b8;
            font-size: 0.65rem;
            margin: 0.35rem 0 0 0;
            line-height: 1.4;
        }
        .embed-dock-foot a {
            color: #6366f1;
            font-weight: 600;
            text-decoration: none;
        }

        [data-testid="stChatMessage"] img { border-radius: 12px; object-fit: cover; }
        </style>
        """,
        unsafe_allow_html=True,
    )


# 이 함수는 앱 전체에 사용할 CSS를 주입합니다.
# 닫힌 상태에서는 아이콘 런처처럼, 열린 상태에서는 실제 상담 챗봇 팝업처럼 보이도록 상태별 스타일을 나눕니다.
def apply_custom_style(widget_open, icon_base64):
    if is_embed_mode():
        apply_embed_styles()
        return

    launcher_style = f"""
        .stButton > button {{
            width: 78px;
            height: 78px;
            border: none;
            border-radius: 26px;
            background:
                linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0)),
                url("data:image/png;base64,{icon_base64}") center / cover no-repeat;
            box-shadow: 0 24px 44px rgba(17, 24, 39, 0.22);
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 1000;
            color: transparent;
            font-size: 0;
        }}
        .stButton > button:hover {{
            transform: translateY(-2px);
        }}
    """ if not widget_open else """
        .stButton > button {
            width: auto;
            min-height: 2.3rem;
            border-radius: 14px;
            border: 1px solid rgba(23, 55, 40, 0.1);
            background: white;
            color: #152118;
            font-size: 0.83rem;
            font-weight: 700;
            text-align: left;
            justify-content: flex-start;
            white-space: normal;
            padding-left: 0.82rem;
            padding-right: 0.82rem;
        }
        .stButton > button:hover {
            border-color: rgba(23, 55, 40, 0.2);
            color: #173728;
        }
    """

    st.markdown(
        f"""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');

        :root {{
            --widget-bg: rgba(255, 255, 255, 0.98);
            --widget-soft: #f5f7f6;
            --widget-line: rgba(23, 55, 40, 0.08);
            --widget-text: #172217;
            --widget-muted: #6b776d;
            --widget-brand: #173728;
            --widget-shadow: 0 28px 60px rgba(12, 30, 19, 0.18);
        }}

        .stApp {{
            background: transparent;
            font-family: 'Noto Sans KR', sans-serif;
            color: var(--widget-text);
        }}

        header[data-testid="stHeader"] {{
            background: transparent;
        }}

        #MainMenu, footer {{
            visibility: hidden;
        }}

        .block-container {{
            max-width: none;
            padding: 0;
        }}

        [data-testid="stVerticalBlock"] > [data-testid="stVerticalBlockBorderWrapper"] > div:empty {{
            display: none;
        }}

        .widget-anchor {{
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: min(410px, calc(100vw - 24px));
            z-index: 999;
        }}

        .widget-shell {{
            background: var(--widget-bg);
            border: 1px solid var(--widget-line);
            border-radius: 30px;
            box-shadow: var(--widget-shadow);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 40px);
        }}

        .widget-header {{
            background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%);
            border-bottom: 1px solid rgba(23, 55, 40, 0.06);
            padding: 0.95rem 1rem 0.8rem 1rem;
        }}

        .brand-row {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
        }}

        .brand-stack {{
            display: flex;
            align-items: center;
            gap: 0.72rem;
        }}

        .brand-logo {{
            width: 34px;
            height: 34px;
            border-radius: 10px;
            object-fit: cover;
            box-shadow: 0 10px 20px rgba(217, 119, 6, 0.16);
        }}

        .brand-name {{
            font-family: 'Outfit', sans-serif;
            font-size: 1.02rem;
            font-weight: 800;
            color: var(--widget-text);
            line-height: 1.05;
        }}

        .brand-subtitle {{
            color: var(--widget-muted);
            font-size: 0.78rem;
            margin-top: 0.18rem;
        }}

        .header-close-wrap button {{
            width: 34px !important;
            min-width: 34px;
            height: 34px;
            min-height: 34px;
            border-radius: 999px !important;
            padding: 0 !important;
            border: 1px solid rgba(23, 55, 40, 0.08) !important;
            background: #ffffff !important;
            color: #657366 !important;
            justify-content: center !important;
            font-size: 1.02rem !important;
            box-shadow: none !important;
        }}

        .widget-intro {{
            margin-top: 0.8rem;
            color: var(--widget-text);
            font-size: 0.9rem;
            line-height: 1.58;
        }}

        .widget-meta {{
            margin-top: 0.4rem;
            color: var(--widget-muted);
            font-size: 0.76rem;
        }}

        .widget-body {{
            padding: 0.9rem 0.9rem 0.8rem 0.9rem;
        }}

        .quick-question-title {{
            color: var(--widget-muted);
            font-size: 0.76rem;
            margin-bottom: 0.45rem;
        }}

        .quick-row {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-bottom: 0.7rem;
        }}

        .chat-scroll-box {{
            height: min(370px, calc(100vh - 320px));
            overflow-y: auto;
            padding-right: 0.1rem;
        }}

        div[data-testid="stChatMessage"] {{
            padding-top: 0.2rem;
            padding-bottom: 0.2rem;
            padding-left: 0;
            padding-right: 0;
            background: transparent;
        }}

        div[data-testid="stChatMessageContent"] {{
            padding: 0;
            background: transparent;
        }}

        div[data-testid="stChatMessage"] [data-testid="stMarkdownContainer"] p {{
            line-height: 1.62;
            font-size: 0.9rem;
            margin-bottom: 0;
        }}

        div[data-testid="stChatMessage"]:has(div[data-testid="chatAvatarIcon-user"]) div[data-testid="stMarkdownContainer"] {{
            background: linear-gradient(135deg, #173728, #2a5240);
            color: white;
            border-radius: 18px 18px 8px 18px;
            padding: 0.82rem 0.95rem;
            box-shadow: 0 10px 22px rgba(23, 55, 40, 0.14);
        }}

        div[data-testid="stChatMessage"]:has(div[data-testid="chatAvatarIcon-assistant"]) div[data-testid="stMarkdownContainer"] {{
            background: white;
            color: var(--widget-text);
            border: 1px solid rgba(23, 55, 40, 0.08);
            border-radius: 18px 18px 18px 8px;
            padding: 0.82rem 0.95rem;
        }}

        .faq-inline-wrap {{
            margin-top: 0.48rem;
            margin-left: 2.25rem;
        }}

        .faq-inline-wrap .stButton {{
            margin-bottom: 0.32rem;
        }}

        .faq-inline-answer {{
            margin-top: 0.08rem;
            margin-bottom: 0.35rem;
            background: var(--widget-soft);
            border: 1px solid rgba(23, 55, 40, 0.08);
            border-radius: 14px;
            padding: 0.72rem 0.82rem;
            color: var(--widget-text);
            font-size: 0.83rem;
            line-height: 1.6;
        }}

        .widget-bottom-actions {{
            display: flex;
            gap: 0.5rem;
            margin-top: 0.8rem;
        }}

        .widget-bottom-actions .stButton button {{
            min-height: 2.28rem;
        }}

        div[data-testid="stForm"] {{
            margin-top: 0.75rem;
            background: var(--widget-soft);
            border: 1px solid rgba(23, 55, 40, 0.08);
            border-radius: 18px;
            padding: 0.72rem 0.72rem 0.34rem 0.72rem;
        }}

        .stTextInput > div > div > input {{
            border-radius: 14px;
            border: 1px solid rgba(23, 55, 40, 0.1);
            min-height: 2.85rem;
            font-size: 0.88rem;
            background: white;
        }}

        div[data-testid="stFormSubmitButton"] > button {{
            width: 100%;
            min-height: 2.45rem;
            border-radius: 14px;
            border: none;
            background: linear-gradient(135deg, #173728, #28533f);
            color: white;
            font-size: 0.84rem;
            font-weight: 800;
        }}

        .widget-footnote {{
            margin-top: 0.6rem;
            color: var(--widget-muted);
            font-size: 0.76rem;
            line-height: 1.5;
        }}

        .widget-footnote a {{
            color: #d97706;
            text-decoration: none;
            font-weight: 700;
        }}

        {launcher_style}

        @media (max-width: 640px) {{
            .widget-anchor {{
                right: 12px;
                bottom: 12px;
                width: calc(100vw - 24px);
            }}

            .chat-scroll-box {{
                height: min(320px, calc(100vh - 300px));
            }}
        }}
        </style>
        """,
        unsafe_allow_html=True,
    )


# 이 함수는 위젯의 열림/닫힘 상태, 세션 아이디, 대화 기록 같은 상태값을 준비합니다.
# 새로고침이 일어나더라도 같은 세션 안에서는 사용자 동작 흐름을 유지할 수 있도록 합니다.
def initialize_session_state():
    if "session_id" not in st.session_state:
        st.session_state.session_id = str(uuid.uuid4())

    if "widget_open" not in st.session_state:
        st.session_state.widget_open = False

    if is_embed_mode():
        st.session_state.widget_open = True

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [
            {
                "role": "assistant",
                "answer": "안녕하세요! GuideMatch FAQ 챗봇입니다. 예약, 환불, 계정, 현장 이슈를 편하게 질문해 주세요.",
                "top_matches": [],
            }
        ]

    if "queued_question" not in st.session_state:
        st.session_state.queued_question = None

    if "expanded_candidate_key" not in st.session_state:
        st.session_state.expanded_candidate_key = None


# 이 함수는 FAQ CSV를 읽고 검색 엔진을 메모리에 준비합니다.
# 앱이 다시 그려져도 매번 벡터 계산을 반복하지 않도록 캐시를 사용합니다.
@st.cache_resource
def load_chatbot_resources():
    csv_path = Path("faq_data.csv")
    if not csv_path.exists():
        raise FileNotFoundError(
            "faq_data.csv 파일이 없습니다. 먼저 create_faq_data.py를 실행해 주세요."
        )
    return initialize_chatbot_engine(csv_path)


# 이 함수는 닫힌 상태에서 보이는 작은 아이콘 런처를 렌더링합니다.
# 아이콘 버튼을 누르면 챗봇 창이 열리고, 이 시점도 로그에 남기도록 연결합니다.
def render_launcher():
    if st.button("open", key="open_widget_launcher"):
        st.session_state.widget_open = True
        log_chat_event("widget_opened", {"message": "launcher clicked"})
        st.rerun()


# 이 함수는 열린 챗봇 위젯의 헤더를 렌더링합니다.
# 회사 로고, 회사명 GuideMatch, 간단한 안내 문구, 닫기 버튼을 상단에 배치합니다.
def render_widget_header(logo_base64):
    st.markdown('<div class="widget-anchor"><div class="widget-shell"><div class="widget-header">', unsafe_allow_html=True)

    left_col, right_col = st.columns([7, 1], gap="small")
    with left_col:
        st.markdown(
            f"""
            <div class="brand-row">
                <div class="brand-stack">
                    <img class="brand-logo" src="data:image/png;base64,{logo_base64}" alt="GuideMatch logo">
                    <div>
                        <div class="brand-name">GuideMatch</div>
                        <div class="brand-subtitle">Will respond in minutes</div>
                    </div>
                </div>
            </div>
            <div class="widget-intro">안녕하세요! 무엇을 도와드릴까요?</div>
            <div class="widget-meta">고객 지원 기록은 사용자 아이디 기준으로 서버 로그에 저장됩니다.</div>
            """,
            unsafe_allow_html=True,
        )

    with right_col:
        st.markdown('<div class="header-close-wrap">', unsafe_allow_html=True)
        if st.button("✕", key="close_widget_button"):
            st.session_state.widget_open = False
            st.session_state.expanded_candidate_key = None
            log_chat_event("widget_closed", {"message": "close button clicked"})
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("</div><div class='widget-body'>", unsafe_allow_html=True)


# 이 함수는 사용자가 자주 누를 만한 빠른 질문 버튼을 위젯 상단에 렌더링합니다.
# 첫 질문을 쉽게 시작할 수 있게 돕고, 어떤 질문들이 가능한지도 자연스럽게 보여줍니다.
def render_quick_questions(key_suffix: str = ""):
    st.markdown('<div class="quick-question-title">빠르게 시작하기</div>', unsafe_allow_html=True)
    st.markdown('<div class="quick-row">', unsafe_allow_html=True)
    col1, col2, col3 = st.columns(3, gap="small")
    with col1:
        if st.button("예약 방법", key=f"quick_booking{key_suffix}"):
            st.session_state.queued_question = "가이드 매칭은 어떻게 진행되나요?"
    with col2:
        if st.button("환불 문의", key=f"quick_refund{key_suffix}"):
            st.session_state.queued_question = "투어 전날 취소하면 환불이 되나요?"
    with col3:
        if st.button("현장 문제", key=f"quick_issue{key_suffix}"):
            st.session_state.queued_question = "약속 장소에 가이드가 안 나타나요."
    st.markdown("</div>", unsafe_allow_html=True)


# 이 함수는 챗봇 메시지에 포함된 추천 FAQ 후보를 최대 3개까지 뽑아 반환합니다.
# 각 후보는 질문과 답변을 함께 가지고 있어, 클릭 즉시 같은 자리에서 답변을 펼쳐 보여줄 수 있습니다.
def get_assistant_candidates(message):
    return message.get("top_matches", [])[:3]


# 이 함수는 실제 채팅 메시지 목록을 렌더링합니다.
# 추천 FAQ 버튼은 문장 길이만큼만 보이는 왼쪽 정렬 형태로 만들고, 클릭하면 바로 아래에서 답변을 펼칩니다.
def render_chat_history(assistant_avatar_path: Optional[str] = None):
    st.markdown('<div class="chat-scroll-box">', unsafe_allow_html=True)

    for message_index, message in enumerate(st.session_state.chat_history):
        if message["role"] == "user":
            avatar = "🙋"
        else:
            avatar = assistant_avatar_path if assistant_avatar_path else "🧭"
        with st.chat_message(message["role"], avatar=avatar):
            st.markdown(message["answer"])

            if message["role"] == "assistant":
                candidates = get_assistant_candidates(message)
                for candidate_index, candidate in enumerate(candidates):
                    button_key = f"candidate_{message_index}_{candidate_index}"
                    st.markdown('<div class="faq-inline-wrap">', unsafe_allow_html=True)
                    if st.button(candidate["question"], key=button_key):
                        st.session_state.expanded_candidate_key = button_key
                        log_chat_event(
                            "recommended_faq_opened",
                            {
                                "question": candidate["question"],
                                "answer": candidate["answer"],
                            },
                        )
                        st.rerun()

                    if st.session_state.expanded_candidate_key == button_key:
                        st.markdown(
                            f"<div class='faq-inline-answer'>{candidate['answer']}</div>",
                            unsafe_allow_html=True,
                        )
                    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)


# 이 함수는 위젯 하단의 보조 버튼, 문의 안내, 입력 폼을 렌더링합니다.
# 고객센터 이메일도 여기에서 함께 노출해, 챗봇으로 해결되지 않는 문의가 바로 이어지도록 합니다.
def render_widget_footer():
    st.markdown('<div class="widget-bottom-actions">', unsafe_allow_html=True)
    left_col, right_col = st.columns(2, gap="small")
    with left_col:
        if st.button("대화 초기화", key="reset_chat_button"):
            st.session_state.chat_history = st.session_state.chat_history[:1]
            st.session_state.expanded_candidate_key = None
            log_chat_event("chat_reset", {"message": "chat reset"})
            st.rerun()
    with right_col:
        if st.button("자세한 문의", key="contact_button"):
            st.session_state.queued_question = "고객센터 이메일이 어떻게 되나요?"
    st.markdown("</div>", unsafe_allow_html=True)

    submitted_question = None
    with st.form("widget_input_form", clear_on_submit=True):
        typed_question = st.text_input(
            "질문 입력",
            placeholder="Type your message",
            label_visibility="collapsed",
        )
        submitted = st.form_submit_button("메시지 보내기")
        if submitted:
            submitted_question = typed_question

    st.markdown(
        """
        <div class="widget-footnote">
            자세한 문의는 고객센터 이메일
            <a href="mailto:leeyob@gmail.com">leeyob@gmail.com</a>
            으로 보내실 수 있습니다.
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.markdown("</div></div></div>", unsafe_allow_html=True)
    return submitted_question


def render_embed_top_bar(icon_base64: str):
    """iframe 상단: 브랜드 + 초기화·이메일 안내 (입력은 하단 고정 도크)."""
    c_icon, c_title, c_actions = st.columns([1, 4, 2])
    with c_icon:
        if icon_base64:
            st.markdown(
                f'<img class="embed-app-icon" src="data:image/png;base64,{icon_base64}" alt="" />',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                '<div class="embed-app-icon-fallback">G</div>',
                unsafe_allow_html=True,
            )
    with c_title:
        st.markdown(
            '<div class="embed-app-titles"><span class="t1">GuideMatch</span>'
            '<span class="t2">FAQ Assistant</span></div>',
            unsafe_allow_html=True,
        )
    with c_actions:
        a1, a2 = st.columns(2, gap="small")
        with a1:
            if st.button("↺", key="embed_tb_reset", help="대화 초기화"):
                st.session_state.chat_history = st.session_state.chat_history[:1]
                st.session_state.expanded_candidate_key = None
                log_chat_event("chat_reset", {"message": "chat reset"})
                st.rerun()
        with a2:
            if st.button("✉", key="embed_tb_mail", help="고객센터 이메일 안내"):
                st.session_state.queued_question = "고객센터 이메일이 어떻게 되나요?"
                st.rerun()


def render_embed_input_dock():
    """하단 고정: 입력 + 전송 (CSS position:fixed)."""
    submitted_question = None
    with st.form("embed_dock_form", clear_on_submit=True):
        row_in, row_btn = st.columns([6, 1], gap="small")
        with row_in:
            typed_question = st.text_input(
                "메시지",
                placeholder="무엇이든 물어보세요…",
                label_visibility="collapsed",
            )
        with row_btn:
            submitted = st.form_submit_button("➤", use_container_width=True)
        st.markdown(
            """
            <p class="embed-dock-foot">
            복잡한 문의는 <a href="mailto:leeyob@gmail.com">leeyob@gmail.com</a>
            </p>
            """,
            unsafe_allow_html=True,
        )
        if submitted:
            submitted_question = typed_question

    return submitted_question


def render_embed_chat(icon_base64, faq_df, vectorizer, question_matrix):
    """iframe 전체 UI: 상단 바 · 스크롤 영역 · 하단 고정 입력."""
    assistant_av = assistant_avatar_path_from_icon(icon_base64)
    render_embed_top_bar(icon_base64)
    st.markdown(
        '<p class="embed-intro">예약·환불·이용 안내를 검색합니다. 아래 칩을 눌러 빠르게 시작할 수 있어요.</p>',
        unsafe_allow_html=True,
    )
    render_quick_questions(key_suffix="_embed")
    render_chat_history(assistant_avatar_path=assistant_av)
    submitted_question = render_embed_input_dock()
    handle_pending_or_submitted_question(
        faq_df,
        vectorizer,
        question_matrix,
        submitted_question=submitted_question,
    )


# 이 함수는 사용자 질문을 FAQ 엔진에 전달하고, 결과를 대화 기록과 로그에 함께 저장합니다.
# 누가 어떤 질문을 했고 어떤 답이 나갔는지 서버 측 파일에 남기도록 여기에서 처리합니다.
def process_user_question(user_question, faq_df, vectorizer, question_matrix, source):
    cleaned_question = user_question.strip()
    if not cleaned_question:
        return

    response = get_chatbot_response(
        user_question=cleaned_question,
        faq_df=faq_df,
        vectorizer=vectorizer,
        question_matrix=question_matrix,
    )

    st.session_state.expanded_candidate_key = None
    st.session_state.chat_history.append(
        {"role": "user", "answer": cleaned_question, "top_matches": []}
    )
    st.session_state.chat_history.append(
        {
            "role": "assistant",
            "answer": response["answer"],
            "top_matches": response.get("top_matches", []),
        }
    )

    log_chat_event(
        "chat_message",
        {
            "source": source,
            "question": cleaned_question,
            "matched_question": response.get("matched_question"),
            "similarity_score": response.get("similarity_score"),
            "answer": response.get("answer"),
        },
    )


# 이 함수는 버튼 질문과 입력 폼 질문을 한 곳에서 처리합니다.
# 어떤 경로로 들어온 질문이든 동일한 검색 로직과 로그 저장 로직을 타도록 구성합니다.
def handle_pending_or_submitted_question(faq_df, vectorizer, question_matrix, submitted_question=None):
    if st.session_state.queued_question:
        queued_question = st.session_state.queued_question
        st.session_state.queued_question = None
        process_user_question(
            queued_question,
            faq_df,
            vectorizer,
            question_matrix,
            source="quick_button",
        )
        st.rerun()

    if submitted_question:
        process_user_question(
            submitted_question,
            faq_df,
            vectorizer,
            question_matrix,
            source="text_input",
        )
        st.rerun()


# 이 함수는 열린 챗봇 위젯 전체를 렌더링합니다.
# 상단 헤더, 빠른 질문, 대화 영역, 문의 메일, 입력 폼을 순서대로 하나의 floating 팝업으로 묶습니다.
def render_open_widget(logo_base64, faq_df, vectorizer, question_matrix):
    render_widget_header(logo_base64)
    render_quick_questions()
    render_chat_history()
    submitted_question = render_widget_footer()
    handle_pending_or_submitted_question(
        faq_df,
        vectorizer,
        question_matrix,
        submitted_question=submitted_question,
    )


# 이 함수는 앱 전체 실행 흐름을 담당합니다.
# 닫힌 상태에서는 아이콘만, 열린 상태에서는 실제 상담창처럼 동작하는 floating 위젯만 표시합니다.
def main():
    st.set_page_config(
        page_title="GuideMatch Floating FAQ Chatbot",
        page_icon=":speech_balloon:",
        layout="wide",
        initial_sidebar_state="collapsed",
    )

    initialize_session_state()
    icon_base64 = encode_image_base64(CHAT_ICON_PATH)
    logo_base64 = encode_image_base64(COMPANY_LOGO_PATH)
    apply_custom_style(st.session_state.widget_open, icon_base64)

    try:
        faq_df, vectorizer, question_matrix = load_chatbot_resources()
    except Exception as error:
        st.error(f"챗봇 데이터를 불러오지 못했습니다: {error}")
        st.info("필요하면 먼저 `python create_faq_data.py`를 실행해 주세요.")
        return

    if is_embed_mode():
        render_embed_chat(icon_base64, faq_df, vectorizer, question_matrix)
        return

    if not st.session_state.widget_open:
        render_launcher()
        return

    render_open_widget(logo_base64, faq_df, vectorizer, question_matrix)


if __name__ == "__main__":
    main()
