/**
 * @file
 *
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Simple logger with log levels
 */

export const enum LogLevel {
    Error = 1,
    Warn,
    Info,
    Debug,
}

export const enum LogMethod {
    Log = 'log',
    Info = 'info',
    Error = 'error',
}

export class Log {
    private static currentLevel = LogLevel.Info;

    public static debug(...args: unknown[]): void {
        Log.print(LogLevel.Debug, LogMethod.Log, args);
    }

    public static info(...args: unknown[]): void {
        Log.print(LogLevel.Info, LogMethod.Info, args);
    }

    public static warn(...args: unknown[]): void {
        Log.print(LogLevel.Warn, LogMethod.Info, args);
    }

    public static error(...args: unknown[]): void {
        Log.print(LogLevel.Error, LogMethod.Error, args);
    }

    private static errorToString(error: Error): string {
        return `${error.toString()}\nStack trace:\n${error.stack}`;
    }

    private static getLocalTimeString(date: Date): string {
        const ONE_MINUTE_MS = 60 * 1000;
        const timeZoneOffsetMs = date.getTimezoneOffset() * ONE_MINUTE_MS;
        const localTime = new Date(date.getMilliseconds() - timeZoneOffsetMs);
        return localTime.toISOString().replace('Z', '');
    }

    private static print(
        level: LogLevel,
        method: LogMethod,
        // eslint-disable-next-line
        args: any[],
    ): void {
        // check log level
        if (this.currentLevel < level) {
            return;
        }
        if (!args || args.length === 0 || !args[0]) {
            return;
        }

        const str = `${args[0]}`;
        args = Array.prototype.slice.call(args, 1);
        let formatted = str.replace(/{(\d+)}/g, (match: string, number: number): string => {
            if (typeof args[number] !== 'undefined') {
                const value = args[number];

                if (value instanceof Error) {
                    return Log.errorToString(value);
                }

                if (typeof value.message === 'string') {
                    return value.message;
                }

                if (typeof value === 'object') {
                    return JSON.stringify(value);
                }

                return String(value);
            }

            return match;
        });

        formatted = `${Log.getLocalTimeString(new Date())}: ${formatted}`;
        // eslint-disable-next-line no-console
        console[method](formatted);
    }
}
