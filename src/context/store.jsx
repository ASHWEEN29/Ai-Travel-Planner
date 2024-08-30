import { create } from "zustand";

const userStore = create((set)=>({
        user: null,
        setUser : (user)=>set({user}),
        tripPlan: '',
        setPlan : (tripPlan)=>set(tripPlan),
}))

export default userStore;