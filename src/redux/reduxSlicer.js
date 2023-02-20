import { createSlice } from '@reduxjs/toolkit';

// import AsyncStorageService from '../../Services/AsyncStorageService';

export const counterSlice = createSlice({
  name: 'reduxStore',
  initialState: {
    userLogin :{"name":"Mukesh"},  
    adminEmpData: {},
  },
  reducers: {
    UserLoginAction:(state,action)=>{
      state.userLogin = action.payload 
    },
    AdminEmpData:(state,action)=>{ 
      state.adminEmpData = action.payload 
    },
   
  }
})
export const {UserLoginAction,AdminEmpData} = counterSlice.actions

export default counterSlice.reducer