export enum LayoutFlags {
    Header,
    Sidebar,
    Container,
    Content,
}

type FlagMethods = {
    [K in keyof typeof LayoutFlags as `${'with' | 'without'}${Capitalize<K>}`]: () => void;
};

export class LayoutOptions implements FlagMethods {
    private flags: LayoutFlags[] = Object.values(LayoutFlags) as any;

    static empty() {
        return LayoutOptions.build().with();
    }

    static build() {
        return new LayoutOptions();
    }

    public with(...flags: LayoutFlags[]) {
        this.flags = flags;
        return this;
    }

    public without(...flags: LayoutFlags[]) {
        this.flags = this.flags.filter((flag) => !flags.includes(flag));
        return this;
    }

    public isEmpty() {
        return this.flags.length === 0;
    }

    public has(...flags: LayoutFlags[]) {
        const filteredFlags = flags.filter((flag) => this.flags.includes(flag));
        return filteredFlags.length > 0;
    }

    public withoutSidebar() {
        return this.without(LayoutFlags.Sidebar);
    }

    public withSidebar() {
        return this.with(LayoutFlags.Sidebar);
    }

    public withoutHeader() {
        return this.without(LayoutFlags.Header);
    }

    public withHeader() {
        return this.with(LayoutFlags.Header);
    }

    public withoutContainer() {
        return this.without(LayoutFlags.Container);
    }

    public withContainer() {
        return this.with(LayoutFlags.Container);
    }

    public withoutContent() {
        return this.without(LayoutFlags.Content);
    }

    public withContent() {
        return this.with(LayoutFlags.Content);
    }
}
