import { TemperatureVO } from '../valueobjects/TemperatureVO';



const TemperatureUtil = () => {
/**
 * Converts a temperature to the unit to be converted
 * @param {TemperatureVO} temperature - Object that contains a value and a unit representing a temperature
 * @param {string} unit - The unit to convert. Valid values ​​are: CELSIUS and FAHRENHEIT.
 * @returns {TemperatureVO} - Object containing a value and unit representing the converted temperature
 */
    function convert(temperature, unit) {
        if (temperature.unit == "CELSIUS" && unit == "FAHRENHEIT") {
            let convertedValue = (temperature.value * 9/5) + 32;
            return new TemperatureVO(convertedValue, unit);
        } else if (temperature.unit == "FAHRENHEIT" && unit == "CELSIUS") {
            let convertedValue = (temperature.value - 32) * 5/9;
            return new TemperatureVO(convertedValue, unit);
        } else {
            return new TemperatureVO(temperature.value, unit);
        }
    }

    return { convert }
}

export default TemperatureUtil;