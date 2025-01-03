// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
const ls = Common.ls;
export const VALUE_INTEPRETER_MAX_NUM_BYTES = 8;
export function valueTypeModeToLocalizedString(mode) {
    switch (mode) {
        case "dec" /* Decimal */:
            return ls `dec`;
        case "hex" /* Hexadecimal */:
            return ls `hex`;
        case "oct" /* Octal */:
            return ls `oct`;
        case "sci" /* Scientific */:
            return ls `sci`;
        case "none" /* None */:
            return ls `none`;
        default:
            return Platform.assertNever(mode, `Unknown mode: ${mode}`);
    }
}
export function endiannessToLocalizedString(endianness) {
    switch (endianness) {
        case "Little Endian" /* Little */:
            return ls `Little Endian`;
        case "Big Endian" /* Big */:
            return ls `Big Endian`;
        default:
            return Platform.assertNever(endianness, `Unknown endianness: ${endianness}`);
    }
}
export function valueTypeToLocalizedString(valueType) {
    switch (valueType) {
        case "Integer 8-bit" /* Int8 */:
            return ls `Integer 8-bit`;
        case "Integer 16-bit" /* Int16 */:
            return ls `Integer 16-bit`;
        case "Integer 32-bit" /* Int32 */:
            return ls `Integer 32-bit`;
        case "Integer 64-bit" /* Int64 */:
            return ls `Integer 64-bit`;
        case "Float 32-bit" /* Float32 */:
            return ls `Float 32-bit`;
        case "Float 64-bit" /* Float64 */:
            return ls `Float 64-bit`;
        case "String" /* String */:
            return ls `String`;
        default:
            return Platform.assertNever(valueType, `Unknown value type: ${valueType}`);
    }
}
export function isValidMode(type, mode) {
    switch (type) {
        case "Integer 8-bit" /* Int8 */:
        case "Integer 16-bit" /* Int16 */:
        case "Integer 32-bit" /* Int32 */:
        case "Integer 64-bit" /* Int64 */:
            return mode === "dec" /* Decimal */ || mode === "hex" /* Hexadecimal */ || mode === "oct" /* Octal */;
        case "Float 32-bit" /* Float32 */:
        case "Float 64-bit" /* Float64 */:
            return mode === "sci" /* Scientific */ || mode === "dec" /* Decimal */;
        case "String" /* String */:
            return mode === "none" /* None */;
        default:
            return Platform.assertNever(type, `Unknown value type: ${type}`);
    }
}
export function isNumber(type) {
    switch (type) {
        case "Integer 8-bit" /* Int8 */:
        case "Integer 16-bit" /* Int16 */:
        case "Integer 32-bit" /* Int32 */:
        case "Integer 64-bit" /* Int64 */:
        case "Float 32-bit" /* Float32 */:
        case "Float 64-bit" /* Float64 */:
            return true;
        default:
            return false;
    }
}
export function format(formatData) {
    const valueView = new DataView(formatData.buffer);
    const isLittleEndian = formatData.endianness === "Little Endian" /* Little */;
    let value;
    try {
        switch (formatData.type) {
            case "Integer 8-bit" /* Int8 */:
                value = formatData.signed ? valueView.getInt8(0) : valueView.getUint8(0);
                return formatInteger(value, formatData.mode);
            case "Integer 16-bit" /* Int16 */:
                value = formatData.signed ? valueView.getInt16(0, isLittleEndian) : valueView.getUint16(0, isLittleEndian);
                return formatInteger(value, formatData.mode);
            case "Integer 32-bit" /* Int32 */:
                value = formatData.signed ? valueView.getInt32(0, isLittleEndian) : valueView.getUint32(0, isLittleEndian);
                return formatInteger(value, formatData.mode);
            case "Integer 64-bit" /* Int64 */:
                value =
                    formatData.signed ? valueView.getBigInt64(0, isLittleEndian) : valueView.getBigUint64(0, isLittleEndian);
                return formatInteger(value, formatData.mode);
            case "Float 32-bit" /* Float32 */:
                value = valueView.getFloat32(0, isLittleEndian);
                return formatFloat(value, formatData.mode);
            case "Float 64-bit" /* Float64 */:
                value = valueView.getFloat64(0, isLittleEndian);
                return formatFloat(value, formatData.mode);
            case "String" /* String */:
                throw new Error(`Type ${formatData.type} is not yet implemented`);
            default:
                return Platform.assertNever(formatData.type, `Unknown value type: ${formatData.type}`);
        }
    }
    catch (e) {
        return 'N/A';
    }
}
export function formatFloat(value, mode) {
    switch (mode) {
        case "dec" /* Decimal */:
            return value.toFixed(2).toString();
        case "sci" /* Scientific */:
            return value.toExponential(2).toString();
        default:
            throw new Error(`Unknown mode for floats: ${mode}.`);
    }
}
export function formatInteger(value, mode) {
    switch (mode) {
        case "dec" /* Decimal */:
            return value.toString();
        case "hex" /* Hexadecimal */:
            return value.toString(16);
        case "oct" /* Octal */:
            return value.toString(8);
        default:
            throw new Error(`Unknown mode for integers: ${mode}.`);
    }
}
//# sourceMappingURL=ValueInterpreterDisplayUtils.js.map