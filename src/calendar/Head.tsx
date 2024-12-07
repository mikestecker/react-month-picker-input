import React, { memo } from 'react';

export interface IProps {
  month: void | number;
  year: void | number;
  lang: string;
  onNext: () => void;
  onPrev: () => void;
  onValueClick: () => void;
}

const Head: React.FC<IProps> = memo(
  ({ month, year, lang, onNext, onPrev, onValueClick }) => {
    const selectedValue = (): string | number => {
      if (typeof year !== 'number') {
        return '';
      } else if (typeof month !== 'number') {
        return year;
      } else {
        const monthVal = month < 10 ? `0${month}` : month;
        return lang === 'ja'
          ? `${year}/${monthVal}`
          : `${monthVal}/${year}`;
      }
    };

    return (
      <div className="section_mp group_mp">
        <div
          className="col_mp span_1_of_3_mp arrows_mp"
          onClick={onPrev}
        >
          &lt;
        </div>
        <div
          className="col_mp span_1_of_3_mp selected_date_mp"
          onClick={onValueClick}
        >
          {selectedValue()}
        </div>
        <div
          className="col_mp span_1_of_3_mp arrows_mp"
          onClick={onNext}
        >
          &gt;
        </div>
      </div>
    );
  }
);

export default Head;
