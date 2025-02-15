import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Text } from '@chakra-ui/react';
import { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

registerLocale('ptBR', ptBR);

interface DateRangePickerProps {
  onChange?: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (onChange) onChange({ startDate: start, endDate: end });
  };

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(firstDayOfMonth);
    setEndDate(now);
  }, []);

  return (
    <Box>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        locale="ptBR"
        inline
      />
    </Box>
  );
};

export default DateRangePicker;