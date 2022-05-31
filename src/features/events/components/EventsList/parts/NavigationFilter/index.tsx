import type { FC } from 'react'

enum FilterType {
  ALL = 'ALL',
  FUTURE = 'FUTURE',
  PAST = 'PAST',
}

type Props = {
  onChange: (filterType: FilterType) => void
}

export const NavigationFilter: FC<Props> = ({ onChange }) => {
  return (
    <ul>
      <li>
        <button type="button" onClick={() => onChange(FilterType.ALL)}>
          All Events
        </button>
      </li>
      <li>
        <button type="button" onClick={() => onChange(FilterType.FUTURE)}>
          Future events
        </button>
      </li>
      <li>
        <button type="button" onClick={() => onChange(FilterType.PAST)}>
          Past Events
        </button>
      </li>
    </ul>
  )
}
