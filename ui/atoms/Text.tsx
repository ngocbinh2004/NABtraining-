import { cx, cva } from 'class-variance-authority'
import React from 'react'

export interface Props {
  breakWord?: 'unset' | 'words' | 'all'
  decoration?: 'underline'
  classNames?: string
  children?: React.ReactNode
  htmlFor?: string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  size?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body2'
    | 'body3'
    | 'body4'
    | 'body5'
    | 'card-title'
    | 'card-label'
    | 'card-content'
    | 'footer'
    | 'menu'
    | 'menu-item'
    | 'list-item'
    | 'list-item-text'
    | 'form-title'
    | 'form-label'
    | 'form-label-error'
    | 'unset'
  align?: 'left' | 'right' | 'center'
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'label'
}

const textClass = cva(['wl-text'], {
  variants: {
    align: {
      left: 'text-left',
      right: 'text-right',
      center: 'text-center',
    },
    size: {
      h1: 'text-h2 font-h2 lg:text-h1 lg:font-h1 font-bold',
      h2: 'text-h3 lg:text-h2 font-h3 lg:font-h2 font-bold',
      h3: 'text-h4 lg:text-h3 font-h4 lg:font-h3 font-bold',
      h4: 'text-h4 font-h3 font-bold',
      body2: 'text-body2 font-body',
      body3: 'text-body2 lg:text-body3 font-body2 lg:font-body',
      body4: 'text-body2 lg:text-body4 font-body2 lg:font-body',
      body5: 'text-body2 lg:text-body5 font-body2 lg:font-body',
      'card-title': 'text-card-title font-card',
      'card-label': 'text-[20px] font-normal leading-7 font-card',
      'card-content': 'text-[24px] font-semibold leading-[34px] font-card',
      footer: 'text-footer font-footer',
      menu: 'text-menu font-menu',
      'menu-item': 'text-menu-item font-menu-item',
      'list-item': 'text-body2 lg:text-list-item font-body2 lg:font-list-item',
      'list-item-text':
        'text-body2 lg:text-list-item-text font-body2 lg:font-list-item',
      'form-title':
        'font-secondary font-semibold text-[32px] leading-[25px] lg:leading-[38px]',
      'form-label':
        'font-secondary font-input--sm text-input-label--sm lg:font-input lg:text-input-label mb-4',
      'form-label-error':
        'font-secondary font-input text-input-label-error text-rose-600',
      unset: '',
    },
    fontWeight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    breakWord: {
      unset: 'whitespace break-words lg:whitespace-nowrap',
      words: 'break-words',
      all: 'break-all',
    },
    decoration: {
      underline: 'underline underline-offset-1 decoration-white text-white',
      none: 'none',
    },
  },
  defaultVariants: {
    align: 'left',
    size: 'body5',
    breakWord: 'words',
  },
})

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4']

export default function Text({
  breakWord,
  classNames,
  fontWeight,
  size,
  component,
  align,
  decoration,
  children,
  htmlFor,
}: Props) {
  const isHeaderComponent = component && HEADING_TAGS.includes(component)
  const Tag = isHeaderComponent
    ? component
    : !isHeaderComponent && component
    ? component
    : 'span'

  return (
    <Tag
      className={cx(
        textClass({ align, decoration, size, fontWeight, breakWord }),
        classNames
      )}
      htmlFor={htmlFor}
    >
      {children}
    </Tag>
  )
}
