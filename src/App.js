// @ts-nocheck
import React, { useState } from "react";
import "./App.scss";
import {
	Card,
	Box,
	FormControl,
	OutlinedInput,
	InputAdornment,
	Fab,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function App() {
	//This is the last updated G-vaule as of 01.05.2020
	const G = 101351;
	//Need the current year for asking about the last 3 years
	const thisYear = new Date().getFullYear();
	//States
	const [inputSalaryState, setInputSalaryState] = useState({
		2017: 400000,
		2019: 500000,
	});
	const [unemploymentBenefits, setUnemploymentBenefits] = useState({
		Basis: 0,
		Amount: 0,
	});

	//This method inserts a value with the corresponding year to the dictionary. It needs to be a number, if not we insert "" and checks for this later
	const handleChange = (year) => (event) => {
		setInputSalaryState({
			...inputSalaryState,
			[year]: !isNaN(event.target.value) ? event.target.value : "",
		});
	};

	//This method is fired when the calulatebutton is pressed
	const handleClickOnCalculateButton = () => {
		//If all values are filled in correctly, calulcate, else show warning
		if (
			Object.keys(inputSalaryState).length === 3 &&
			inputSalaryState[thisYear - 1] !== "" &&
			inputSalaryState[thisYear - 2] !== "" &&
			inputSalaryState[thisYear - 3] !== ""
		) {
			document.getElementById("missingInputWarning").classList.remove("Show");
			showCalculatedResult();
		} else {
			document.getElementById("missingInputWarning").classList.add("Show");
			document.getElementById("ResultContainer").classList.add("Hidden");
		}
	};

	//This method handles the showing of the calculated result
	const showCalculatedResult = () => {
		calculateUnemploymentBenefits();
		document.getElementById("ResultContainer").classList.remove("Hidden");
	};

	//Calculates the result
	const calculateUnemploymentBenefits = () => {
		let salaryLastThreeYears =
			parseInt(inputSalaryState[thisYear - 1]) +
			parseInt(inputSalaryState[thisYear - 2]) +
			parseInt(inputSalaryState[thisYear - 3]);
		let salaryLastYear = parseInt(inputSalaryState[thisYear - 1]);

		//Check if the user meets the requirements. I was a little uncertain if I should have used >= or >, but used > because of the word "over" given as criteria
		let meetsRequirementsForUnemploymentBenefits =
			salaryLastThreeYears > 3 * G || salaryLastYear > 1.5 * G ? true : false;
		if (!meetsRequirementsForUnemploymentBenefits) {
			setUnemploymentBenefits({
				Basis: parseInt(Math.max(salaryLastThreeYears / 3, salaryLastYear)),
				Amount: 0,
			});
		} else {
			//Checks which sum to use, based on the highest sum of either the average of the last three years or the last years salary. Can't be over 6G, if so we use 6G as basis
			let unemploymentBenefitsBasis =
				Math.max(salaryLastThreeYears / 3, salaryLastYear) <= 6 * G
					? parseInt(Math.max(salaryLastThreeYears / 3, salaryLastYear))
					: 6 * G;
			let unemploymentBenefitsAmount = meetsRequirementsForUnemploymentBenefits
				? Math.ceil(unemploymentBenefitsBasis / 260)
				: 0;
			setUnemploymentBenefits({
				Basis: unemploymentBenefitsBasis,
				Amount: unemploymentBenefitsAmount,
			});
		}
	};

	return (
		<Box className="App">
			<Card className="Container">
				<Box className="IntroContainer">
					<h1>Velkommen</h1>
					<h2>
						La oss sjekke om du har rett på dagpenger. Start med å fylle ut
						skjemaet under:
					</h2>
				</Box>

				<Box className="InputContainer">
					<h3>Din årsinntekt i {thisYear - 1}:</h3>
					<FormControl fullWidth variant="outlined">
						<OutlinedInput
							value={inputSalaryState[thisYear - 1] || ''}
							onChange={handleChange(thisYear - 1)}
							endAdornment={<InputAdornment position="end">NOK</InputAdornment>}
							aria-label="annual salary 1 year ago"
							type="number"
							inputProps={{ "data-testid": "inputField1YearAgo" }}
							onClick={() => document.getElementById("ResultContainer").classList.add("Hidden")}
						/>
					</FormControl>
					<h3>Din årsinntekt i {thisYear - 2}:</h3>
					<FormControl fullWidth variant="outlined">
						<OutlinedInput
							value={inputSalaryState[thisYear - 2] || ''}
							onChange={handleChange(thisYear - 2)}
							endAdornment={<InputAdornment position="end">NOK</InputAdornment>}
							aria-label="annual salary 2 years ago "
							type="number"
							inputProps={{ "data-testid": "inputField2YearsAgo" }}
							onClick={() => document.getElementById("ResultContainer").classList.add("Hidden")}
						/>
					</FormControl>
					<h3>Din årsinntekt i {thisYear - 3}:</h3>
					<FormControl fullWidth variant="outlined">
						<OutlinedInput
							value={inputSalaryState[thisYear - 3] || ''}
							onChange={handleChange(thisYear - 3)}
							endAdornment={<InputAdornment position="end">NOK</InputAdornment>}
							aria-label="annual salary 3 years ago"
							type="number"
							inputProps={{ "data-testid": "inputField3YearsAgo" }}
							onClick={() => document.getElementById("ResultContainer").classList.add("Hidden")}
						/>
					</FormControl>
				</Box>

				<p className="ErrorMessage" id="missingInputWarning">
					Du må fylle inn alle feltene!
				</p>

				<Box className="CalculateButtonContainer">
					<Fab
						onClick={handleClickOnCalculateButton}
						aria-labelledby="Calculate"
						variant="extended"
						alt="Calculatebutton"
						id="calculateButton"
					>
						<h2>Beregn dagpenger</h2>
					</Fab>
				</Box>
			</Card>

			<Card className="Container Hidden" id="ResultContainer">
				<h1>Du får innvilget {unemploymentBenefits["Amount"]}kr</h1>
				<p>
					{unemploymentBenefits["Amount"] === 0
						? "Du oppfyller ikke kravene på dagpenger. Ditt dagpengegrunnlag baseres på "
						: "Du oppfyller kravene på dagpenger. Ditt dagpengegrunnlag baseres på "}
					{unemploymentBenefits["Basis"] === 6 * G
						? "6G ettersom du har tjent mer enn dette."
						: unemploymentBenefits["Basis"] ===
						  parseInt(inputSalaryState[thisYear - 1])
						? "din inntekt for det siste året, som er "
						: "din gjennomsnittsinntekt for de tre siste årene, som er "}
					{unemploymentBenefits["Basis"] !== 6 * G
						? unemploymentBenefits["Basis"] + "kr."
						: ""}
				</p>
				<Accordion className="Accordion">
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="Information about calculation"
					>
						<p>Hvordan foregår denne utregningen?</p>
					</AccordionSummary>
					<AccordionDetails className="AccordionContainer">
						<div>
							<b>Krav for dagpenger</b>
							<p>
								For å få innvilget dagpenger må man enten ha tjent til sammen
								over 3G de siste 3 kalenderårene, eller ha tjent over 1.5G
								forrige kalenderår ({thisYear - 1}). Grunnbeløpet, kalt G,
								brukes til å beregne mange av NAVs ytelser. Grunnbeløpet
								justeres 1. mai hvert år og blir fastsatt etter trygdeoppgjøret.
								Grunnbeløpet (G) per 1. mai 2020 er kr 101 351.
							</p>
						</div>
						<div>
							<b>Dagpengegrunnlag</b>
							<p>
								Dagpengegrunnlaget er den høyeste verdien av enten inntekten
								siste kalenderåret, eller gjennomsnittsinntekten de siste tre
								kalenderårene. Dagpengegrunnlaget kan ikke være høyere enn 6G.
							</p>
						</div>
						<div>
							<b>Dagsats</b>
							<p>
								For å finne dagsatsen deler man dagpengegrunnlaget på antall
								arbeidsdager i året, rundet opp. I NAV har vi definert antall
								arbeidsdager i et år til å være 260.
							</p>
						</div>
					</AccordionDetails>
				</Accordion>
			</Card>
		</Box>
	);
}

export default App;
