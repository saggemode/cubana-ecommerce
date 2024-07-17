import clsx from 'clsx'
import React from 'react'

const Price = ({
  amount,
  className,
  currencyCode = 'NGN',
  currencyCodeClassName,
  contentClass,
}: {
  amount: string
  className?: string
  currencyCode?: string
  currencyCodeClassName?: string
  contentClass?: string
} & React.ComponentProps<'p'>) => {
  // Validate currency code
  const validCurrencyCodes = [
    'NGN',
    'EUR',
    'GBP',
    '' /* Add more valid currency codes if needed */,
  ]
  const validatedCurrencyCode = validCurrencyCodes.includes(
    currencyCode.toUpperCase()
  )
    ? currencyCode.toUpperCase()
    : 'NGN'

  return (
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: validatedCurrencyCode,
        currencyDisplay: 'narrowSymbol',
      }).format(parseFloat(amount))}`}
      <span
        className={clsx(
          'ml-1 inline text-green-500 !leading-none',
          currencyCodeClassName
        )}
      >{`${validatedCurrencyCode}`}</span>
    </p>
  )
}

export default Price

// import clsx from 'clsx';
// import React from 'react';

// const Price = ({
//   amount,
//   className,
//   currencyCode = 'NGN',
//   currencyCodeClassName
// }: {
//   amount: string;
//   className?: string;
//   currencyCode?: string;
//   currencyCodeClassName?: string;
// } & React.ComponentProps<'p'>) => {
//   // Validate currency code
//   const validCurrencyCodes = ['NGN', 'EUR', 'GBP', '', /* Add more valid currency codes if needed */];
//   const validatedCurrencyCode = validCurrencyCodes.includes(currencyCode.toUpperCase()) ? currencyCode.toUpperCase() : 'NGN';

//   return (
//     <p suppressHydrationWarning={true} className={className}>
//       {`${new Intl.NumberFormat(undefined, {
//         style: 'currency',
//         currency: validatedCurrencyCode,
//         currencyDisplay: 'narrowSymbol'
//       }).format(parseFloat(amount))}`}
//       <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${validatedCurrencyCode}`}</span>
//     </p>
//   );
// };

// export default Price;
