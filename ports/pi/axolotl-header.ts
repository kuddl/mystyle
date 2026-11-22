/**
 * Axolotl Pi Extension
 *
 * Custom Pi startup header with Axolotl mascot & brand palette
 */

import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import { VERSION } from "@earendil-works/pi-coding-agent";

// Pixel art mascot half-block lines for Axolotl
// 8 lines tall x 16 columns wide
function getAxolotlMascot(theme: Theme): string[] {
	// ANSI 24-bit TrueColor sequences
	const P = "\x1b[38;2;255;133;184m"; // Pink
	const M = "\x1b[38;2;106;229;181m"; // Mint
	const C = "\x1b[38;2;86;183;236m";  // Cyan
	const V = "\x1b[38;2;94;38;246m";   // Violet
	const D = "\x1b[38;2;9;9;11m";      // Dark / Eyes
	const R = "\x1b[0m";                 // Reset

	// Half-block pairs [top, bottom] rendered as ▀
	// Line 0: row 0 & 1
	// Line 1: row 2 & 3
	// Line 2: row 4 & 5
	// Line 3: row 6 & 7
	// Line 4: row 8 & 9
	// Line 5: row 10 & 11
	// Line 6: row 12 & 13
	// Line 7: row 14 & 15

	return [
		`    ${V}▄${R} ${C}▀${R} ${V}▄${R}  ${V}▄${R} ${C}▀${R} ${V}▄${R}    `,
		` ${M}▀${P}▄${C}▀${P}▄${P}▀${P}▄${P}▀${P}▀${P}▄${P}▀${P}▄${C}▀${P}▄${M}▀${R} `,
		`  ${V}▄${P}▀${D}▀${P}▀${P}▀${P}▀${P}▀${D}▀${P}▀${V}▄${R}  `,
		`   ${P}▀${M}▀${P}▀${P}▀${P}▀${P}▀${P}▀${M}▀${P}▄${R}   `,
		`    ${P}▀${M}▀${R} ${P}▀${M}▀${R} ${P}▀${R}    `,
		`   ${P}▄${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▄${R}   `,
		`   ${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${P}▀${R}   `,
		`    ${M}▄${P}▀${P}▀${R}  ${P}▀${P}▀${M}▄${R}    `,
	];
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.mode === "tui") {
			ctx.ui.setHeader((_tui, theme) => {
				return {
					render(_width: number): string[] {
						const mascot = getAxolotlMascot(theme);
						const title = `   ${theme.fg("accent", "Axolotl Suite")}${theme.fg("dim", ` · pi v${VERSION}`)}`;
						const subtitle = `   ${theme.fg("muted", "obsidian · natty · arcane")}`;
						const divider = `   ${theme.fg("dim", "───────────────────────────────────")}`;
						const hint = `   ${theme.fg("dim", "Press Tab to toggle tools · / for commands")}`;

						// Render mascot on left side, details on right side
						const lines: string[] = [
							"",
							`${mascot[0]}  ${title}`,
							`${mascot[1]}  ${subtitle}`,
							`${mascot[2]}  ${divider}`,
							`${mascot[3]}  ${hint}`,
							`${mascot[4]}`,
							`${mascot[5]}`,
							`${mascot[6]}`,
							`${mascot[7]}`,
							"",
						];
						return lines;
					},
					invalidate() {},
				};
			});
		}
	});

	pi.registerCommand("axolotl-header", {
		description: "Restore or toggle Axolotl custom header",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Axolotl Header is active", "info");
		},
	});

	pi.registerCommand("builtin-header", {
		description: "Restore built-in Pi header",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Built-in Pi header restored", "info");
		},
	});
}
