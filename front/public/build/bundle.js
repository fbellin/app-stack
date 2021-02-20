
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (85:1) {#each filteredPeople as user, i}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*user*/ ctx[15].password + "";
    	let t0;
    	let t1;
    	let t2_value = /*user*/ ctx[15].email + "";
    	let t2;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = text(", ");
    			t2 = text(t2_value);
    			option.__value = /*i*/ ctx[3];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-lxvsk7");
    			add_location(option, file, 85, 2, 1498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filteredPeople*/ 2 && t0_value !== (t0_value = /*user*/ ctx[15].password + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*filteredPeople*/ 2 && t2_value !== (t2_value = /*user*/ ctx[15].email + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(85:1) {#each filteredPeople as user, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let input0;
    	let t0;
    	let select;
    	let t1;
    	let label0;
    	let input1;
    	let t2;
    	let label1;
    	let input2;
    	let t3;
    	let div;
    	let button0;
    	let t4;
    	let button0_disabled_value;
    	let t5;
    	let button1;
    	let t6;
    	let button1_disabled_value;
    	let t7;
    	let button2;
    	let t8;
    	let button2_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value = /*filteredPeople*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			label0 = element("label");
    			input1 = element("input");
    			t2 = space();
    			label1 = element("label");
    			input2 = element("input");
    			t3 = space();
    			div = element("div");
    			button0 = element("button");
    			t4 = text("create");
    			t5 = space();
    			button1 = element("button");
    			t6 = text("update");
    			t7 = space();
    			button2 = element("button");
    			t8 = text("delete");
    			attr_dev(input0, "placeholder", "filter prefix");
    			attr_dev(input0, "class", "svelte-lxvsk7");
    			add_location(input0, file, 81, 0, 1371);
    			attr_dev(select, "size", 5);
    			attr_dev(select, "class", "svelte-lxvsk7");
    			if (/*i*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file, 83, 0, 1428);
    			attr_dev(input1, "placeholder", "email");
    			attr_dev(input1, "class", "svelte-lxvsk7");
    			add_location(input1, file, 89, 7, 1582);
    			attr_dev(label0, "class", "svelte-lxvsk7");
    			add_location(label0, file, 89, 0, 1575);
    			attr_dev(input2, "placeholder", "password");
    			attr_dev(input2, "class", "svelte-lxvsk7");
    			add_location(input2, file, 90, 7, 1644);
    			attr_dev(label1, "class", "svelte-lxvsk7");
    			add_location(label1, file, 90, 0, 1637);
    			button0.disabled = button0_disabled_value = !/*email*/ ctx[4] || !/*password*/ ctx[5];
    			attr_dev(button0, "class", "svelte-lxvsk7");
    			add_location(button0, file, 93, 1, 1729);
    			button1.disabled = button1_disabled_value = !/*email*/ ctx[4] || !/*password*/ ctx[5] || !/*selected*/ ctx[2];
    			attr_dev(button1, "class", "svelte-lxvsk7");
    			add_location(button1, file, 94, 1, 1805);
    			button2.disabled = button2_disabled_value = !/*selected*/ ctx[2];
    			attr_dev(button2, "class", "svelte-lxvsk7");
    			add_location(button2, file, 95, 1, 1894);
    			attr_dev(div, "class", "buttons svelte-lxvsk7");
    			add_location(div, file, 92, 0, 1706);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*prefix*/ ctx[0]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*i*/ ctx[3]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label0, anchor);
    			append_dev(label0, input1);
    			set_input_value(input1, /*email*/ ctx[4]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input2);
    			set_input_value(input2, /*password*/ ctx[5]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t4);
    			append_dev(div, t5);
    			append_dev(div, button1);
    			append_dev(button1, t6);
    			append_dev(div, t7);
    			append_dev(div, button2);
    			append_dev(button2, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13]),
    					listen_dev(button0, "click", /*create*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*update*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*remove*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*prefix*/ 1 && input0.value !== /*prefix*/ ctx[0]) {
    				set_input_value(input0, /*prefix*/ ctx[0]);
    			}

    			if (dirty & /*filteredPeople*/ 2) {
    				each_value = /*filteredPeople*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*i*/ 8) {
    				select_option(select, /*i*/ ctx[3]);
    			}

    			if (dirty & /*email*/ 16 && input1.value !== /*email*/ ctx[4]) {
    				set_input_value(input1, /*email*/ ctx[4]);
    			}

    			if (dirty & /*password*/ 32 && input2.value !== /*password*/ ctx[5]) {
    				set_input_value(input2, /*password*/ ctx[5]);
    			}

    			if (dirty & /*email, password*/ 48 && button0_disabled_value !== (button0_disabled_value = !/*email*/ ctx[4] || !/*password*/ ctx[5])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*email, password, selected*/ 52 && button1_disabled_value !== (button1_disabled_value = !/*email*/ ctx[4] || !/*password*/ ctx[5] || !/*selected*/ ctx[2])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*selected*/ 4 && button2_disabled_value !== (button2_disabled_value = !/*selected*/ ctx[2])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let filteredPeople;
    	let selected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let users = [];
    	let prefix = "";
    	let email = "";
    	let password = "";
    	let i = 0;

    	function create() {
    		$$invalidate(9, users = users.concat({ email, password }));
    		$$invalidate(3, i = users.length - 1);
    		$$invalidate(4, email = $$invalidate(5, password = ""));
    	}

    	function update() {
    		$$invalidate(9, users[i] = { email, password }, users);
    	}

    	function remove() {
    		$$invalidate(9, users = [...users.slice(0, i), ...users.slice(i + 1)]);
    		$$invalidate(4, email = $$invalidate(5, password = ""));
    		$$invalidate(3, i = Math.min(i, users.length - 1));
    	}

    	function reset_inputs(person) {
    		$$invalidate(4, email = person ? person.first : "");
    		$$invalidate(5, password = person ? person.last : "");
    	}

    	onMount(async () => {
    		const response = await fetch("http://localhost:8080/users", {
    			headers: { "Content-Type": "text/plain" }
    		});

    		let result = response.json();
    		$$invalidate(9, users = result.data);
    	}); //return response.data

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		prefix = this.value;
    		$$invalidate(0, prefix);
    	}

    	function select_change_handler() {
    		i = select_value(this);
    		$$invalidate(3, i);
    	}

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(4, email);
    	}

    	function input2_input_handler() {
    		password = this.value;
    		$$invalidate(5, password);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		users,
    		prefix,
    		email,
    		password,
    		i,
    		create,
    		update,
    		remove,
    		reset_inputs,
    		filteredPeople,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ("users" in $$props) $$invalidate(9, users = $$props.users);
    		if ("prefix" in $$props) $$invalidate(0, prefix = $$props.prefix);
    		if ("email" in $$props) $$invalidate(4, email = $$props.email);
    		if ("password" in $$props) $$invalidate(5, password = $$props.password);
    		if ("i" in $$props) $$invalidate(3, i = $$props.i);
    		if ("filteredPeople" in $$props) $$invalidate(1, filteredPeople = $$props.filteredPeople);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*prefix, users*/ 513) {
    			$$invalidate(1, filteredPeople = prefix
    			? users.filter(user => {
    					const name = `${user.email}, ${user.password}`;
    					return name.toLowerCase().startsWith(prefix.toLowerCase());
    				})
    			: users);
    		}

    		if ($$self.$$.dirty & /*filteredPeople, i*/ 10) {
    			$$invalidate(2, selected = filteredPeople[i]);
    		}

    		if ($$self.$$.dirty & /*selected*/ 4) {
    			reset_inputs(selected);
    		}
    	};

    	return [
    		prefix,
    		filteredPeople,
    		selected,
    		i,
    		email,
    		password,
    		create,
    		update,
    		remove,
    		users,
    		input0_input_handler,
    		select_change_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
