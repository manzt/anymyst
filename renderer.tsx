/**
 * A custom renderer for Myst to support anywidget front-end modules
 * @module
 *
 * Note: this code needs to live in myst-theme Document
 *
 * @example
 * ```
 * <Document renderers={{ ...renderers, any:  AnyMystRenderer }}></Document>
 * ```
 */
import * as React from "react";

/**
 * A shim for the anywidget model interface
 * @see {@link https://github.com/manzt/anywidget/tree/main/packages/types}
 */
class MystAnyModel {
	#state: Record<string, unknown>;
	#target = new EventTarget();
	constructor(state: Record<string, unknown>) {
		this.#state = state;
	}
	get(name: string) {
		return this.#state[name];
	}
	set(key: string, value: unknown) {
		this.#state[key] = value;
		this.#target.dispatchEvent(
			new CustomEvent(`change:${key}`, { detail: value }),
		);
		this.#target.dispatchEvent(
			new CustomEvent("change", { detail: value }),
		);
	}
	on(name: string, cb: () => void | Promise<void>) {
		this.#target.addEventListener(name, cb);
	}
	off(_name: string, _cb: () => void | Promise<void>) {
		// TODO: should keep ref to listeners and then remove here
	}
	save_changes() {
		// nothing to sync but necessary
	}
	send(_msg: unknown, _callbacks?: unknown, _buffers?: ArrayBuffer[]) {
		throw new Error("MystAnyModel.send not implemented yet.");
	}
	get widget_manager() {
		throw new Error("MystAnyModel.widget_manager does not exist.");
	}
}

type AnyMystDirective = {
	/** The type of the directive */
	type: "any";
	/** The ES module to import */
	import: string;
	/** The data to pass to the model */
	data: { json: Record<string, unknown> };
};

export function AnyMystRenderer({ node }: { node: AnyMystDirective }) {
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		// @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#implementing_an_abortable_api
		const controller = new AbortController();

		// if already aborted just ignore
		if (controller.signal.aborted) {
			return;
		}

		let maybeCleanupInitialize: undefined | (() => void | Promise<void>) =
			undefined;
		let maybeCleanupRender: undefined | (() => void | Promise<void>) =
			undefined;

		controller.signal.addEventListener("abort", async () => {
			await maybeCleanupRender?.();
			await maybeCleanupInitialize?.();
		});

		import(node.import).then(async (mod) => {
			// TODO: validation
			const widget = mod.default;
			// TODO: validate the widget
			const model = new MystAnyModel(node.data.json);
			maybeCleanupInitialize = await widget.initialize?.({ model });

			// clear current contents
			ref.current?.replaceChildren();
			maybeCleanupRender = await widget.render?.({
				model,
				el: ref.current,
			});
		});
		return () => {
			controller?.abort();
		};
	}, [node]);
	return <div className="relative w-full" ref={ref} />;
}
