import React, { useState, useRef, useEffect } from 'react';
import InputMask from 'react-input-mask';
import MonthCalendar from './calendar';
import {
  valuesToMask,
  valuesFromMask,
  validationOfDate,
} from './utils';
import Translator from './Translator';

import './styles/index.css';

export interface IProps {
  year?: number;
  month?: number;
  inputProps?: {
    name?: string;
    id?: string;
    className?: string;
    size?: string | number;
    maxLength?: string | number;
    required?: boolean;
  };
  maxYear?: number;
  startYear?: number;
  minDate?: [number, number];
  maxDate?: [number, number];
  lang?: string;
  onChange?: (
    maskedValue: string,
    year: number,
    month: number
  ) => void;
  closeOnSelect?: boolean;
  i18n?: Partial<any>;
  mode?: 'normal' | 'readOnly' | 'calendarOnly';
}

const MonthPickerInput: React.FC<IProps> = ({
  year,
  month,
  inputProps = {},
  maxYear,
  startYear,
  minDate,
  maxDate,
  lang,
  onChange,
  closeOnSelect = false,
  i18n,
  mode = 'normal',
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<
    number | undefined
  >(year);
  const [selectedMonth, setSelectedMonth] = useState<
    number | undefined
  >(month);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputMask = new Translator(lang, i18n)
    .dateFormat()
    .replace(/M|Y/g, '9');

  useEffect(() => {
    setInputValue(
      valuesToMask(month, year, new Translator(lang, i18n))
    );
  }, [month, year, lang, i18n]);

  const handleCalendarChange = (year: number, month: number) => {
    const [minDateRange, maxDateRange] = validationOfDate(
      minDate,
      maxDate,
      maxYear
    );
    const [finalMonth, finalYear] = valuesFromMask(
      valuesToMask(month, year, new Translator(lang, i18n)),
      new Translator(lang, i18n),
      minDateRange,
      maxDateRange
    );

    setInputValue(
      valuesToMask(finalMonth, finalYear, new Translator(lang, i18n))
    );
    setSelectedYear(finalYear);
    setSelectedMonth(finalMonth);
    setShowCalendar(!closeOnSelect);

    if (onChange) onChange(inputValue, finalYear, finalMonth);
  };

  const inputPropsWithHandlers = {
    ...inputProps,
    mask: inputMask,
    placeholder: new Translator(lang, i18n).dateFormat(),
    type: 'text',
    onFocus: () => setShowCalendar(true),
    onBlur: (e: FocusEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    },
    value: inputValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
  };

  return (
    <div ref={wrapperRef} className="react-month-picker">
      <InputMask {...inputPropsWithHandlers} />
      {showCalendar && (
        <MonthCalendar
          year={selectedYear}
          month={selectedMonth}
          maxYear={maxYear}
          startYear={startYear}
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleCalendarChange}
          onOutsideClick={() => setShowCalendar(false)}
          translator={new Translator(lang, i18n)}
          readOnly={mode === 'readOnly'}
        />
      )}
    </div>
  );
};

export default MonthPickerInput;
