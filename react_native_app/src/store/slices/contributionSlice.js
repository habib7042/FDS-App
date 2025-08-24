import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contributionService } from '../../services/contributionService';

const initialState = {
  contributions: [],
  isLoading: false,
  error: null,
  filters: {
    memberId: null,
    year: new Date().getFullYear(),
    month: null,
  },
  statistics: {
    totalAmount: 0,
    totalCount: 0,
    monthlyAverage: 0,
  },
};

export const fetchContributions = createAsyncThunk(
  'contribution/fetchContributions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await contributionService.getContributions(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addContribution = createAsyncThunk(
  'contribution/addContribution',
  async (contributionData, { rejectWithValue }) => {
    try {
      const response = await contributionService.addContribution(contributionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateContribution = createAsyncThunk(
  'contribution/updateContribution',
  async ({ id, contributionData }, { rejectWithValue }) => {
    try {
      const response = await contributionService.updateContribution(id, contributionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContribution = createAsyncThunk(
  'contribution/deleteContribution',
  async (id, { rejectWithValue }) => {
    try {
      await contributionService.deleteContribution(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateContributionReport = createAsyncThunk(
  'contribution/generateContributionReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await contributionService.generateReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const contributionSlice = createSlice({
  name: 'contribution',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    calculateStatistics: (state) => {
      const filteredContributions = state.contributions.filter(contribution => {
        if (state.filters.memberId && contribution.memberId !== state.filters.memberId) {
          return false;
        }
        if (state.filters.year && contribution.year !== state.filters.year) {
          return false;
        }
        if (state.filters.month && contribution.month !== state.filters.month) {
          return false;
        }
        return true;
      });

      state.statistics.totalAmount = filteredContributions.reduce((sum, c) => sum + c.amount, 0);
      state.statistics.totalCount = filteredContributions.length;
      state.statistics.monthlyAverage = filteredContributions.length > 0 
        ? state.statistics.totalAmount / filteredContributions.length 
        : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contributions
      .addCase(fetchContributions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContributions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contributions = action.payload.contributions || action.payload;
      })
      .addCase(fetchContributions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Contribution
      .addCase(addContribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addContribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contributions.unshift(action.payload);
      })
      .addCase(addContribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Contribution
      .addCase(updateContribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContribution.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.contributions.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contributions[index] = action.payload;
        }
      })
      .addCase(updateContribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Contribution
      .addCase(deleteContribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contributions = state.contributions.filter(c => c.id !== action.payload);
      })
      .addCase(deleteContribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate Report
      .addCase(generateContributionReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateContributionReport.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(generateContributionReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, calculateStatistics } = contributionSlice.actions;
export default contributionSlice.reducer;