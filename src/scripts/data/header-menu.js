export const HEADER_SUBMENU_ITEMS = {
    akl: [
        { label: '소개' },
        { label: '공간/시설' },
        { label: '프로그램' },
        { label: '입주기업' },
    ],
    rental: [
        { label: '공간/시설' },
        { label: '대관 안내' },
        { label: '이용 안내' },
    ],
    biz: [
        { label: '프로그램' },
        { label: '비즈컨설팅' },
        { label: '입주기업' },
    ],
    community: [
        { label: '공지사항' },
        { label: '공모소식' },
        { label: '뉴스레터' },
    ],
    archive: [
        { label: '페스티벌' },
        { label: '기술용어 사전' },
        { label: '자료실' },
    ],
};

export const MOBILE_SIDEBAR_MENU_ITEMS = [
    { id: 'akl', label: '아트코리아랩', items: HEADER_SUBMENU_ITEMS.akl },
    { id: 'rental', label: '대관/시설', items: HEADER_SUBMENU_ITEMS.rental },
    { id: 'biz', label: '비즈센터', items: HEADER_SUBMENU_ITEMS.biz },
    { id: 'community', label: '커뮤니티', items: HEADER_SUBMENU_ITEMS.community },
    { id: 'archive', label: '아카이브', items: HEADER_SUBMENU_ITEMS.archive },
    {
        id: 'mypage',
        label: '마이페이지',
        items: [
            { label: '신청 내역' },
            { label: '관심 프로그램' },
            { label: '회원정보' },
        ],
    },
];

export const MOBILE_SIDEBAR_ACCORDION_DURATION = 280;
