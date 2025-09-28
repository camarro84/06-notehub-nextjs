'use client'
import ReactPaginate from 'react-paginate'
import css from './Pagination.module.css'

interface PaginationProps {
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={(e: { selected: number }) => onPageChange(e.selected)}
      previousLabel="Prev"
      nextLabel="Next"
      breakLabel="…"
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      renderOnZeroPageCount={null}
    />
  )
}
