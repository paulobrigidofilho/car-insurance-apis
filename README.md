# Mission 2: Car Insurance Risk and Value APIs

This project provides two APIs: `riskRating` and `carValue`. The `riskRating` API assesses car insurance risk based on claim history, enabling quick and reliable quote generation. The `carValue` API estimates the value of a car based on its model and year, providing a baseline for insurance calculations.

## Installation

To get started, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/MR-2025-PT-March-L5ADV/mission-2-app-aliance.git
cd mission-2-app-aliance
npm install
```

To run the application:

```bash
npm start
```

### Dependencies

This project uses the following key dependencies:
- **express**: For creating the API server.
- **dotenv**: For managing environment variables.
- **jest**: For unit testing.

Ensure Jest is installed. If not, run the following command:

```bash
npm install --save-dev jest
```

## API Details

### `riskRating` API

**Description:**
Calculates a risk rating (0-5) for car insurance based on a text description of the claim history. A higher risk rating indicates a higher likelihood of future claims.

**Endpoint:**
```
POST /api/risk-rating/calculate
```

**Request Body:**
```json
{
  "claim_history": "Description of the car accident history"
}
```

**Response Body (Success):**
```json
{
  "risk_rating": 3
}
```

**Response Body (Error):**
```json
{
  "error": "Error message describing the issue"
}
```

**Example Usage:**
The API identifies risk indicators, even with typos or variations in phrasing (e.g., "collide," "collided," "collision"). Includes specific handling for "total loss" scenarios, which automatically assigns a risk rating of 5.

### `carValue` API

**Description:**
Estimates the value of a car based on its model and year. This value can be used as a starting point for determining insurance premiums.

**Endpoint:**
```
POST /api/car-value
```

**Request Body:**
```json
{
  "model": "Car Model Name",
  "year": 2020
}
```

**Response Body (Success):**
```json
{
  "value": 2500
}
```

**Response Body (Error):**
```json
{
  "error": "Error message describing the issue"
}
```

**Example Usage:**
The car value is calculated by summing the alphabetical positions of the letters in the model name, multiplying by 100, and adding the year. For example, a "BMW" manufactured in 2022 would have a value of:
```
(2 + 13 + 23) * 100 + 2022 = 3800 + 2022 = 5822
```

## Testing

To run the unit tests, use the following command:

```bash
npm test
```

This will execute the test suites defined in the `test/` directory, ensuring the APIs function as expected.

## Error Handling

The APIs provide informative error messages in the response body to help diagnose issues. Common error scenarios include:
- Invalid input data (e.g., missing or incorrect data types in the request body).
- Internal server errors (e.g., unexpected exceptions during processing).

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory of the project and define the following variables:

- `PORT`: The port on which the server will listen (default: 4000).

## Contributors

Andre & Paulo

