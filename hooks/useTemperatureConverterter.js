import {useState}  from 'react';
import TemperatureUtil from '../utils/TemperatureUtil';
import { TemperatureVO } from '../valueobjects/TemperatureVO';

const useTemperatureConverter = () => {
    const [celsius, setCelsius] = useState('');
    const [fahrenheit, setFahrenheit] = useState('');
    const { convert } = TemperatureUtil();
    
    function convertTemperature() {
        let originalCelsius = new TemperatureVO(celsius, 'CELSIUS')
        let convertedFahrenheit = convert(originalCelsius, 'FAHRENHEIT');
        setFahrenheit(convertedFahrenheit.value);
    }

    return { celsius, setCelsius, fahrenheit, setFahrenheit, convertTemperature }
}

export default useTemperatureConverter;