import { createSlice } from "@reduxjs/toolkit";


const addContractSlice = createSlice({
	name: "addContract",
	initialState: {
		userId: null, // User ID who is creating the contract
        startDate: null,
        endDate: '',
        dayCount: '',
        vehicleId: null,
        vehicleData: null, // Full vehicle object
        pricePerDay: '',
        totalPrice: '',
        discount: '',
        pickUpTime: '',
        dropOffTime: '',
        kmAtTheStart: '',
        kmAtTheEnd: '',
        fuelLevelAtTheStart: '',
        fuelLevelAtTheEnd: '',
        allowKmPerDay: '',
        insuranceDeposit: '',
        contractStatus: 'new',
        carImages: [],
        transactions: [],
        additionalFees: []
	},
	reducers: {
		setUserId: (state, action) => {
			state.userId = action.payload;
		},
		setUserData: (state, action) => {
			state.userData = action.payload;
			state.userId = action.payload ? action.payload.id : null;
		},
		setStartDate: (state, action) => {
			state.startDate = action.payload;
		},
		setEndDate: (state, action) => {
			state.endDate = action.payload;
		},
		setDayCount: (state, action) => {
			state.dayCount = action.payload;
		},
		setVehicleId: (state, action) => {
			state.vehicleId = action.payload;
		},
		setVehicleData: (state, action) => {
			state.vehicleData = action.payload;
			state.vehicleId = action.payload ? action.payload.id : null;
			// Automatically set price per day from selected vehicle
			state.pricePerDay = action.payload ? action.payload.pricePerDay.toString() : '';
		},
		setPricePerDay: (state, action) => {
			state.pricePerDay = action.payload;
		},
		setTotalPrice: (state, action) => {
			state.totalPrice = action.payload;
		},
		setDiscount: (state, action) => {
			state.discount = action.payload;
		},
		setPickUpTime: (state, action) => {
			state.pickUpTime = action.payload;
		},
		setDropOffTime: (state, action) => {
			state.dropOffTime = action.payload;
		},
		setKmAtTheStart: (state, action) => {
			state.kmAtTheStart = action.payload;
		},
		setKmAtTheEnd: (state, action) => {
			state.kmAtTheEnd = action.payload;
		},
		setFuelLevelAtTheStart: (state, action) => {
			state.fuelLevelAtTheStart = action.payload;
		},
		setFuelLevelAtTheEnd: (state, action) => {
			state.fuelLevelAtTheEnd = action.payload;
		},
		setAllowKmPerDay: (state, action) => {
			state.allowKmPerDay = action.payload;
		},
		setInsuranceDeposit: (state, action) => {
			state.insuranceDeposit = action.payload;
		},
		setContractStatus: (state, action) => {
			state.contractStatus = action.payload;
		},
		setCarImages: (state, action) => {
			state.carImages = action.payload;
		},
		// Transactions actions
		addTransaction: (state, action) => {
			state.transactions.push(action.payload);
		},
		removeTransaction: (state, action) => {
			state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
		},
		setTransactions: (state, action) => {
			state.transactions = action.payload;
		},
		// Additional fees actions
		addAdditionalFee: (state, action) => {
			state.additionalFees.push(action.payload);
		},
		removeAdditionalFee: (state, action) => {
			state.additionalFees = state.additionalFees.filter(fee => fee.id !== action.payload);
		},
		setAdditionalFees: (state, action) => {
			state.additionalFees = action.payload;
		},
		resetForm: (state) => {
			state.userId = null;
			state.userData = null;
			state.startDate = null;
			state.endDate = '';
			state.dayCount = '';
			state.vehicleId = null;
			state.vehicleData = null;
			state.pricePerDay = '';
			state.totalPrice = '';
			state.discount = '';
			state.pickUpTime = '';
			state.dropOffTime = '';
			state.kmAtTheStart = '';
			state.kmAtTheEnd = '';
			state.fuelLevelAtTheStart = '';
			state.fuelLevelAtTheEnd = '';
			state.allowKmPerDay = '';
			state.insuranceDeposit = '';
			state.contractStatus = 'new';
			state.carImages = [];
			state.transactions = [];
			state.additionalFees = [];
		}
	}
});


export const {
	setUserId,
	setUserData,
	setStartDate,
	setEndDate,
	setDayCount,
	setVehicleId,
	setVehicleData,
	setPricePerDay,
	setTotalPrice,
	setDiscount,
	setPickUpTime,
	setDropOffTime,
	setKmAtTheStart,
	setKmAtTheEnd,
	setFuelLevelAtTheStart,
	setFuelLevelAtTheEnd,
	setAllowKmPerDay,
	setInsuranceDeposit,
	setContractStatus,
	setCarImages,
	addTransaction,
	removeTransaction,
	setTransactions,
	addAdditionalFee,
	removeAdditionalFee,
	setAdditionalFees,
	resetForm
} = addContractSlice.actions;

export default addContractSlice.reducer;

