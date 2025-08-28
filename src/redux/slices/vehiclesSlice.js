import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Example async thunk to fetch vehicles from the local api JSON (adjust path as needed)
export const fetchVehicles = createAsyncThunk("vehicles/fetch", async () => {
	const res = await fetch("/api/cars.json");
	if (!res.ok) throw new Error("Failed to fetch vehicles");
	return res.json();
});

const vehiclesSlice = createSlice({
	name: "vehicles",
	initialState: {
		items: [],
		status: "idle",
		error: null,
	},
	reducers: {
		setVehicles(state, action) {
			state.items = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchVehicles.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchVehicles.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchVehicles.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { setVehicles } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;

