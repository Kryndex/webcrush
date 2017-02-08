(function() {

function _decompress(length, resetValue, getNextValue) {
	var dictionary = [],
			next,
			enlargeIn = 4,
			dictSize = 4,
			numBits = 3,
			entry = "",
			result = [],
      mpow = Math.pow,
			i,
			w,
			bits, resb, maxpower, power,
			c,
			data = {v:getNextValue(0), p:resetValue, i:1};

	for (i = 0; i < 3; i += 1) {
		dictionary[i] = i;
	}

	bits = 0;
	maxpower = mpow(2,2);
	power=1;
	while (power!=maxpower) {
		resb = data.v & data.p;
		data.p >>= 1;
		if (data.p == 0) {
			data.p = resetValue;
			data.v = getNextValue(data.i++);
		}
		bits |= (resb>0 ? 1 : 0) * power;
		power <<= 1;
	}

	switch (next = bits) {
		case 0:
				bits = 0;
				maxpower = mpow(2,8);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
			c = f(bits);
			break;
		case 1:
				bits = 0;
				maxpower = mpow(2,16);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
			c = f(bits);
			break;
		case 2:
			return "";
	}
	dictionary[3] = c;
	w = c;
	result.push(c);
	while (true) {
		if (data.i > length) {
			return "";
		}

		bits = 0;
		maxpower = mpow(2,numBits);
		power=1;
		while (power!=maxpower) {
			resb = data.v & data.p;
			data.p >>= 1;
			if (data.p == 0) {
				data.p = resetValue;
				data.v = getNextValue(data.i++);
			}
			bits |= (resb>0 ? 1 : 0) * power;
			power <<= 1;
		}

		switch (c = bits) {
			case 0:
				bits = 0;
				maxpower = mpow(2,8);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}

				dictionary[dictSize++] = f(bits);
				c = dictSize-1;
				enlargeIn--;
				break;
			case 1:
				bits = 0;
				maxpower = mpow(2,16);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
				dictionary[dictSize++] = f(bits);
				c = dictSize-1;
				enlargeIn--;
				break;
			case 2:
				return result.join('');
		}

		if (enlargeIn == 0) {
			enlargeIn = mpow(2, numBits);
			numBits++;
		}

		if (dictionary[c]) {
			entry = dictionary[c];
		} else {
			if (c === dictSize) {
				entry = w + w.charAt(0);
			} else {
        // Should not happen.
				// return null;
			}
		}
		result.push(entry);

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + entry.charAt(0);
		enlargeIn--;

		w = entry;

		if (enlargeIn == 0) {
			enlargeIn = mpow(2, numBits);
			numBits++;
		}

	}
}

// Now decompress
var f = String.fromCharCode,
    script = document.scripts[0],
    input = script.text.substr(2).replace(/\*.*$/,''),
    keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    baseReverseDic = {};

for (var i = 0; i < keyStrBase64.length ; i++) {
  baseReverseDic[keyStrBase64.charAt(i)] = i;
}

script.parentElement.removeChild(script);
document.write(_decompress(input.length, 32, function(i) { return baseReverseDic[input.charAt(i)]; }));

})();
