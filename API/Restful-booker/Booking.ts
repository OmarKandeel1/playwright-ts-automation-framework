import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { Constants } from "./Constants";
import bookingData from "../../test-data/Restful-booker/booking-data";
export class Booking {
    
    constructor(private request: APIRequestContext) {
       
    }

    private baseUrl = Constants.BASE_URL;
    private endPoint = "/booking"

    async getBooking(id: number): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/booking/${id}`);
    }



    async getBookingJson(id: number) {
        const response = await this.getBooking(id);

        if (!response.ok()) {
            throw new Error(`Failed to fetch booking. Status: ${response.status()}`);
        }

        return await response.json();
    }

    async getBookingByParamJson(param : Record<string, string>){
        const response = await this.request.get(`${this.baseUrl}${this.endPoint}`, {params : param});
          if (!response.ok()) {
            throw new Error(`Failed to fetch booking. Status: ${response.status()}`);
        }

        return await response.json();
    }

    async getFreshBookingID()
    {
        const response = await this.createBooking(bookingData.user,bookingData.header);
        return await response.bookingid;
    }


    async createBooking(body : object , header ?: Record<string , string>){
        const response = await this.request.post(`${this.baseUrl}${this.endPoint}`,{
            data : body,
            headers : header
        });
         if (!response.ok()) {
            throw new Error(`Failed to fetch booking. Status: ${response.status()}`);
        }

        return await response.json();
    }



}