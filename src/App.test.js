import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

describe("Tests on the calculator", () => {
	it("Missing input should return a visible errormessage", function () {
		act(() => {
			render(<App />, container);
		});
		expect(screen.getByText(/Du må fylle inn et gyldig tall i alle feltene!/i));
	});

	it("Salary of 500k, 450k and 400k to return 1924kr", function () {
		act(() => {
			render(<App />, container);
		});
		//Have to fill in the input
		const input1 = screen.getByTestId("inputField1YearAgo");
		const input2 = screen.getByTestId("inputField2YearsAgo");
		const input3 = screen.getByTestId("inputField3YearsAgo");
		fireEvent.change(input1, { target: { value: 500000 } });
		expect(parseInt(input1.value)).toBe(500000);
		fireEvent.change(input2, { target: { value: 450000 } });
		expect(parseInt(input2.value)).toBe(450000);
		fireEvent.change(input3, { target: { value: 400000 } });
		expect(parseInt(input3.value)).toBe(400000);

		//Have to click the button
		const calculateButton = screen.getByRole("button", {
			name: /Calculatebutton/i,
		});
		calculateButton.click();

		//Checks if the sum is right
		expect(screen.getByText(/1924kr/i));
	});

	it("Salary of over 6G should limit to 6G", function () {
		act(() => {
			render(<App />, container);
		});
		//Have to fill in the input
		const input1 = screen.getByTestId("inputField1YearAgo");
		const input2 = screen.getByTestId("inputField2YearsAgo");
		const input3 = screen.getByTestId("inputField3YearsAgo");
		fireEvent.change(input1, { target: { value: 1000000 } });
		expect(parseInt(input1.value)).toBe(1000000);
		fireEvent.change(input2, { target: { value: 450000 } });
		expect(parseInt(input2.value)).toBe(450000);
		fireEvent.change(input3, { target: { value: 400000 } });
		expect(parseInt(input3.value)).toBe(400000);

		//Have to click the button
		const calculateButton = screen.getByRole("button", {
			name: /Calculatebutton/i,
		});
		calculateButton.click();

		//Checks if the word 6G appears in the result
		expect(screen.getByText(/Ditt dagpengegrunnlag baseres på 6G/i));
	});

	it("Should select the highest amount of either the average of last 3 years, or last year", function () {
		act(() => {
			render(<App />, container);
		});
		//Have to fill in the input
		const input1 = screen.getByTestId("inputField1YearAgo");
		const input2 = screen.getByTestId("inputField2YearsAgo");
		const input3 = screen.getByTestId("inputField3YearsAgo");
		fireEvent.change(input1, { target: { value: 500000 } });
		expect(parseInt(input1.value)).toBe(500000);
		fireEvent.change(input2, { target: { value: 300000 } });
		expect(parseInt(input2.value)).toBe(300000);
		fireEvent.change(input3, { target: { value: 300000 } });
		expect(parseInt(input3.value)).toBe(300000);

		//Have to click the button
		const calculateButton = screen.getByRole("button", {
			name: /Calculatebutton/i,
		});
		calculateButton.click();

		//Checks if the amount chosen is last year and that the amount is 1924kr
		expect(screen.getByText(/Ditt dagpengegrunnlag baseres på din inntekt for det siste året/i));
		expect(screen.getByText(/1924kr/i));
		
		//Have to fill in the input again
		fireEvent.change(input1, { target: { value: 400000 } });
		expect(parseInt(input1.value)).toBe(400000);
		fireEvent.change(input2, { target: { value: 550000 } });
		expect(parseInt(input2.value)).toBe(550000);
		fireEvent.change(input3, { target: { value: 550000 } });
		expect(parseInt(input3.value)).toBe(550000);

		//Have to click the button
		calculateButton.click();

		//Checks if the amount chosen is the average and that the amount is 1924kr
		expect(screen.getByText(/Ditt dagpengegrunnlag baseres på din gjennomsnittsinntekt for de tre siste årene/i));
		expect(screen.getByText(/1924kr/i));
	});
});
