import { createSlice } from '@reduxjs/toolkit';

const carsSlice = createSlice({
  name: 'cars',
  initialState: {} as Record<string, unknown>,
  reducers: {},
});

export default carsSlice.reducer;
