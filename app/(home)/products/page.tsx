import { MainLayout } from '@/components/main-layout'
import React from 'react'
import { Listing } from './components/Listing'
import getProducts from '@/actions/getProducts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { APP_NAME } from '@/constants/constant'
import ProductService from '@/actions/services/productService'
import Rating from '@/components/rating'
import ProductItem from './components/ProductItem'

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  {
    name: '$1 to $100',
    value: '1-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
]

const ratings = [4, 3, 2, 1]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
                 ${category !== 'all' ? ` : Category ${category}` : ''}
                 ${price !== 'all' ? ` : Price ${price}` : ''}
                 ${
                   rating !== 'all' ? ` : Rating ${rating}` : ''
                 } - ${APP_NAME}`,
    }
  } else {
    return {
      title: `Search Products - ${APP_NAME}`,
    }
  }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/products?${new URLSearchParams(params).toString()}`
  }

  const categories = await ProductService.getCategories()
  const filteredCategories = categories.filter(
    (c): c is string => c !== undefined
  )

  const { countProducts, products, pages } = await ProductService.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })
  return (
    // <MainLayout className="flex flex-col items-start gap-6 md:flex-row md:gap-8 pt-20 mt-20">
    //   {/* <h4>hello</h4>

    //   <Listing allProducts={products} /> */}

    //   <div>
    //     <div className="text-xl pt-3">Department</div>
    //     <div>
    //       <ul>
    //         <li>
    //           <Link
    //             className={`${
    //               ('all' === category || '' === category) && 'text-primary'
    //             }`}
    //             href={getFilterUrl({ c: 'all' })}
    //           >
    //             Any
    //           </Link>
    //         </li>
    //         {/* {categories.map((c: { name: string }) => (
    //           <li key={c.name}>
    //             <Link
    //               className={`${c.name === category && 'text-primary'}`}
    //               href={getFilterUrl({ c: c.name })}
    //             >
    //               {c.name}
    //             </Link>
    //           </li>
    //         ))} */}
    //       </ul>
    //     </div>
    //     <div>
    //       <div className="text-xl pt-3">Price</div>
    //       <ul>
    //         <li>
    //           <Link
    //             className={`  ${'all' === price && 'text-primary'}`}
    //             href={getFilterUrl({ p: 'all' })}
    //           >
    //             Any
    //           </Link>
    //         </li>
    //         {prices.map((p) => (
    //           <li key={p.value}>
    //             <Link
    //               href={getFilterUrl({ p: p.value })}
    //               className={`  ${p.value === price && 'text-primary'}`}
    //             >
    //               {p.name}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //     <div>
    //       <div className="text-xl pt-3">Customer Review</div>
    //       <ul>
    //         <li>
    //           <Link
    //             href={getFilterUrl({ r: 'all' })}
    //             className={`  ${'all' === rating && 'text-primary'}`}
    //           >
    //             Any
    //           </Link>
    //         </li>
    //         {ratings.map((r) => (
    //           <li key={r}>
    //             <Link
    //               href={getFilterUrl({ r: `${r}` })}
    //               className={`${r.toString() === rating && 'text-primary'}`}
    //             >
    //               {`${r} stars & up`}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>
    //   <div className="md:col-span-4 space-y-4">
    //     <div className="flex-between flex-col md:flex-row my-4">
    //       <div className="flex items-center">
    //         {/* {data.length === 0 ? 'No' : countProducts} Results */}
    //         {q !== 'all' && q !== '' && 'Query : ' + q}
    //         {category !== 'all' &&
    //           category !== '' &&
    //           '   Category : ' + category}
    //         {price !== 'all' && '    Price: ' + price}
    //         {rating !== 'all' && '    Rating: ' + rating + ' & up'}
    //         &nbsp;
    //         {(q !== 'all' && q !== '') ||
    //         (category !== 'all' && category !== '') ||
    //         rating !== 'all' ||
    //         price !== 'all' ? (
    //           <Button variant={'link'} asChild>
    //             <Link href="/search">Clear</Link>
    //           </Button>
    //         ) : null}
    //       </div>
    //       <div>
    //         Sort by{' '}
    //         {sortOrders.map((s) => (
    //           <Link
    //             key={s}
    //             className={`mx-2   ${sort == s && 'text-primary'} `}
    //             href={getFilterUrl({ s })}
    //           >
    //             {s}
    //           </Link>
    //         ))}
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
    //       {products!.data.length === 0 && <div>No product found</div>}
    //       {/* {products!.data.map((product) => (
    //         <ProductCard key={product.id} product={product} />
    //       ))}
    //     </div>
    //     {products!.totalPages! > 1 && (
    //       <Pagination page={page} totalPages={products!.totalPages} />
    //     )} */}
    //   </div>
    // </MainLayout>

    <MainLayout className="flex flex-col items-start gap-6 md:flex-row md:gap-8 pt-20 mt-20">
      <div>
        <div className="text-xl pt-3">Department</div>
        <div>
          <ul>
            <li>
              <Link
                className={`${
                  ('all' === category || '' === category) && 'text-primary'
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {filteredCategories.map((c: string) => (
              <li key={c}>
                <Link
                  className={`${c === category && 'text-primary'}`}
                  href={getFilterUrl({ c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Price</div>
          <ul>
            <li>
              <Link
                className={`  ${'all' === price && 'text-primary'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`  ${p.value === price && 'text-primary'}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Customer Review</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`  ${'all' === rating && 'text-primary'}`}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`${r.toString() === rating && 'text-primary'}`}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {/* {data.length === 0 ? 'No' : countProducts} Results */}
            {q !== 'all' && q !== '' && 'Query : ' + q}
            {category !== 'all' &&
              category !== '' &&
              '   Category : ' + category}
            {price !== 'all' && '    Price: ' + price}
            {rating !== 'all' && '    Rating: ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href="/products">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2   ${sort == s && 'text-primary'} `}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
          {products!.length === 0 && <div>No product found</div>}
          {products!.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
        {/* {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )} */}
      </div>
    </MainLayout>
  )
}
