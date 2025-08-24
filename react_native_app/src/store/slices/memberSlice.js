import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { memberService } from '../../services/memberService';

const initialState = {
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchMembers = createAsyncThunk(
  'member/fetchMembers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await memberService.getAllMembers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMemberByAccount = createAsyncThunk(
  'member/fetchMemberByAccount',
  async (accountNumber, { rejectWithValue }) => {
    try {
      const response = await memberService.getMemberByAccount(accountNumber);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createMember = createAsyncThunk(
  'member/createMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await memberService.createMember(memberData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMember = createAsyncThunk(
  'member/updateMember',
  async ({ id, memberData }, { rejectWithValue }) => {
    try {
      const response = await memberService.updateMember(id, memberData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMember = createAsyncThunk(
  'member/deleteMember',
  async (id, { rejectWithValue }) => {
    try {
      await memberService.deleteMember(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMember: (state, action) => {
      state.currentMember = action.payload;
    },
    clearCurrentMember: (state) => {
      state.currentMember = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Members
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.members || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Member by Account
      .addCase(fetchMemberByAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberByAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload;
      })
      .addCase(fetchMemberByAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Member
      .addCase(createMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.unshift(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Member
      .addCase(updateMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        if (state.currentMember?.id === action.payload.id) {
          state.currentMember = action.payload;
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Member
      .addCase(deleteMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = state.members.filter(m => m.id !== action.payload);
        if (state.currentMember?.id === action.payload) {
          state.currentMember = null;
        }
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentMember, clearCurrentMember, setPagination } = memberSlice.actions;
export default memberSlice.reducer;