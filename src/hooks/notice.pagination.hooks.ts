import { useEffect, useState } from "react";

// variable: 페이지 당 아이템 수 //
const ITEMS_PER_PAGE = 10;

// variable: 섹션 당 아이템 수 //
const PAGES_PER_SECTION = 5;

const useNoticePagination = <T>() => {

  // state: 페이징 관련 상태 //
  const [totalList, setTotalList] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalSection, setTotalSection] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [pageList, setPageList] = useState<number[]>([]);
  const [viewList, setViewList] = useState<T[]>([]);

  // function: 전체 리스트 변경 함수 //
  const init = (totalList: T[]) => {
    const totalCount = totalList.length;
    setTotalCount(totalCount);

    const totalPage = Math.ceil(totalCount / ITEMS_PER_PAGE);
    setTotalPage(totalPage);

    const totalSection = Math.ceil(totalPage / PAGES_PER_SECTION);
    setTotalSection(totalSection);

    setCurrentPage(1);
    setCurrentSection(1);
    initViewList(totalList);
  };

  // function: 페이지 변경 함수 //
  const initViewList = (totalList: T[]) => {

    const totalCount = totalList.length;
    const startIndex = ITEMS_PER_PAGE * (currentPage - 1);
    let endIndex = startIndex + ITEMS_PER_PAGE;
    if (endIndex > totalCount) endIndex = totalCount;

    const viewList = totalList.slice(startIndex, endIndex);
    setViewList(viewList);
  };

  // function: 섹션 변경 함수 //
  const initPageList = (totalPage: number) => {
    if (!totalPage) {
      setPageList([]);
      return;
    }

    const startPage = PAGES_PER_SECTION * currentSection - (PAGES_PER_SECTION - 1);
    let endPage = PAGES_PER_SECTION * currentSection;
    if (endPage > totalPage) endPage = totalPage;
    const pageList = [];
    for (let page = startPage; page <= endPage; page++) {
      pageList.push(page);
    }
    setPageList(pageList);
  };

  // event handler: 페이지 클릭 이벤트 처리 함수 //
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  }

  // event handler: 이전 섹션 클릭 이벤트 처리 함수 //
  const onPreSectionClickHandler = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);

      // 이전 페이지가 현재 섹션의 첫 번째 페이지였다면 섹션도 감소
      if ((currentPage - 1) % PAGES_PER_SECTION === 0) {
        setCurrentSection(currentSection - 1);
      }
    }
  };

  // event Handler: 다음 섹션 클릭 이벤트 처리 함수 //
  const onNextSectionClickHandler = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);

      // 다음 페이지가 새 섹션의 첫 번째 페이지라면 섹션도 증가
      if (currentPage % PAGES_PER_SECTION === 0) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  // effect: totalList가 변경될 시 실행 //
  useEffect(() => {
    init(totalList);
  }, [totalList]);

  // effect: 현재 섹션이 변경될 시 실행할 함수 //
  useEffect(() => {
    initPageList(totalPage);
  }, [totalCount, currentSection]);

  useEffect(() => {
    initViewList(totalList);
  }, [currentPage]);

  return {
    currentPage,
    totalPage,
    totalCount,
    totalSection,
    viewList,
    pageList,
    setTotalList,
    setTotalPage,
    setTotalSection,
    initViewList,
    onPageClickHandler,
    onPreSectionClickHandler,
    onNextSectionClickHandler
  };

}

export default useNoticePagination;