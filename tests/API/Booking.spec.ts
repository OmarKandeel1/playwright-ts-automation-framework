import { test, expect, request } from '@playwright/test';
import { Booking } from '../../API/Restful-booker/Booking';
import bookingData from '../../test-data/Restful-booker/booking-data.js';


test.describe('Booking Api tests', () => {



    test('Check single booking', async ({ request }) => {

        const booking = new Booking(request);

        const body = await booking.getBookingJson(await booking.getFreshBookingID());

        expect(body.firstname).toBeDefined()
        expect(body.lastname).toBeDefined()
        expect(body.bookingdates.checkin).toBeDefined();
        expect(body.bookingdates.checkout).toBeDefined();
    });


    test("Validate Query Params", async ({ request }) => {
        const booking = new Booking(request);
        const qParam = {
            "firstname": "John"
        };

        const jRespone = await booking.getBookingByParamJson(qParam);

        console.log(jRespone);

        expect(Array.isArray(jRespone)).toBeTruthy();
        expect(jRespone.length).toBeGreaterThan(0);
    });


    test('Validating creating booking ', async ({ request }) => {
        const booking = new Booking(request);
        const user = bookingData.user;

        const header = bookingData.header;
        const body = await booking.createBooking(user , header);
        console.log(body);

        expect(user.firstname).toBe(body.booking.firstname);
        expect(user.lastname).toBe(body.booking.lastname);
        expect(body.booking).toMatchObject(user);

    });





});