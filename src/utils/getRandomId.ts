export type ID = String;

export default (): ID =>
    `${toBase64(new Date().getUTCMonth())}${new Date().getUTCDate()}${toBase64(new Date().getUTCDay())}${toBase64(new Date().getUTCHours())}${toBase64(new Date().getUTCMinutes())}${toBase64(
        new Date().getUTCSeconds()
    )}${toBase64(new Date().getUTCMilliseconds())}${toBase64(parseInt(Math.random().toString().split('.').pop() || Date.now().toString()))}`;


/**
* @description A custom base64 encoder for ID gen.
* @param {number} input A numerical value to be encoded
* @returns encoded string
*/
function toBase64(input:number) {
    let hash = '',
        alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#',
        alphabetLength = alphabet.length;

    do {
        hash = alphabet[input % alphabetLength] + hash;
        input = parseInt((input / alphabetLength).toString(), 10);
    } while (input);

    return hash;
}