import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import OutsideClickWrapper from '../OutsideClickWrapper';

import Head from './Head';
import { VIEW_MONTHS, VIEW_YEARS } from './constants';
import { validationOfDate } from '../utils';

import Translator from '../Translator';

export interface IProps {
  year: void | number;
  month: void | number;
  startYear?: number;
  maxYear?: number;
  minDate?: [number, number];
  maxDate?: [number, number];
  onChange: (selectedYear: number, selectedMonth: number) => void;
  onOutsideClick: (e: any) => void;
  translator: Translator;
  readOnly?: boolean;
}

const MonthCalendar: React.FC<IProps> = ({
  year,
  month,
  startYear,
  maxYear,
  minDate,
  maxDate,
  onChange,
  onOutsideClick,
  translator,
  readOnly = false,
}) => {
  const [currentView, setCurrentView] = useState(
    year ? VIEW_MONTHS : VIEW_YEARS
  );
  const [selectedYear, setSelectedYear] = useState<
    number | undefined
  >(year);
  const [selectedMonth, setSelectedMonth] = useState<
    number | undefined
  >(month);
  const [years, setYears] = useState<number[]>([]);

  const minMaxDate = useMemo(
    () => validationOfDate(minDate, maxDate, maxYear),
    [minDate, maxDate, maxYear]
  );

  const getNormalizedStartYear = useCallback(
    (initialStartYear?: number): number => {
      const minYear = minMaxDate[0][1];
      const start =
        initialStartYear || year || new Date().getFullYear() - 6;
      return Math.max(start, minYear);
    },
    [minMaxDate, year]
  );

  useEffect(() => {
    setYears(
      Array.from(
        { length: 12 },
        (_, k) => k + getNormalizedStartYear(startYear)
      )
    );
  }, [getNormalizedStartYear, startYear]);

  useEffect(() => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setCurrentView(year ? VIEW_MONTHS : VIEW_YEARS);
  }, [year, month]);

  const selectYear = (year: number) => {
    if (readOnly) return;

    const minYear = minMaxDate[0][1];
    const normalizedYear = Math.max(year, minYear);
    setSelectedYear(normalizedYear);
    setCurrentView(VIEW_MONTHS);
    onChange(normalizedYear, selectedMonth as number);
  };

  const selectMonth = (month: number) => {
    if (readOnly) return;

    const [[minMonth, minYear], [maxMonth, maxYear]] = minMaxDate;
    const normalizedMonth =
      selectedYear === maxYear
        ? Math.min(month, maxMonth)
        : selectedYear === minYear
        ? Math.max(month, minMonth)
        : month;

    setSelectedMonth(normalizedMonth);
    onChange(selectedYear as number, normalizedMonth);
  };

  const updateYears = (startYear: number) => {
    setYears(
      Array.from(
        { length: 12 },
        (_, k) => k + getNormalizedStartYear(startYear)
      )
    );
    setCurrentView(VIEW_YEARS);
  };

  const previous = () => {
    if (readOnly) return;

    const newStartYear = years[0] - 12;
    updateYears(newStartYear);
  };

  const next = () => {
    if (readOnly) return;

    const maxYear = minMaxDate[1][1];
    const nextStartYear = years[11] + 1;
    const startYear = Math.min(nextStartYear + 11, maxYear - 11);

    updateYears(startYear);
  };

  const renderMonths = () =>
    translator.monthNames().map((monthName, index) => {
      const isSelected =
        selectedMonth === index ? 'selected_cell' : '';
      return (
        <div
          key={index}
          onClick={() => selectMonth(index)}
          className={`col_mp span_1_of_3_mp ${isSelected}`}
        >
          {translator.monthName(monthName)}
        </div>
      );
    });

  const renderYears = () =>
    years.map((year, index) => {
      const maxYear = minMaxDate[1][1];
      const isDisabled = year > maxYear;
      const isSelected = selectedYear === year ? 'selected_cell' : '';

      if (isDisabled) return <div key={index} />;

      return (
        <div
          key={index}
          onClick={() => selectYear(year)}
          className={`col_mp span_1_of_3_mp ${isSelected}`}
        >
          {year}
        </div>
      );
    });

  return (
    <OutsideClickWrapper
      onOutsideClick={onOutsideClick}
      className={`calendar-container ${readOnly ? 'readonly' : ''}`}
    >
      <Head
        year={selectedYear}
        month={selectedMonth ? selectedMonth + 1 : 1}
        lang={translator.lang}
        onValueClick={() => setCurrentView(VIEW_YEARS)}
        onPrev={previous}
        onNext={next}
      />
      {currentView === VIEW_YEARS ? renderYears() : renderMonths()}
    </OutsideClickWrapper>
  );
};

export default MonthCalendar;
