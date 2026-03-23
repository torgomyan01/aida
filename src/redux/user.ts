import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userInfo',
  initialState: {} as Record<string, unknown>,
  reducers: {},
});

export default userSlice.reducer;
