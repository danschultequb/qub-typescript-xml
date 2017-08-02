import * as qub from "qub";

/**
 * The different types of Lexes in an XML document.
 */
export const enum LexType {
    LeftAngleBracket,
    RightAngleBracket,
    LeftSquareBracket,
    RightSquareBracket,
    QuestionMark,
    ExclamationPoint,
    Dash,
    SingleQuote,
    DoubleQuote,
    Equals,
    Underscore,
    Period,
    Colon,
    Semicolon,
    Ampersand,
    ForwardSlash,
    Whitespace,
    NewLine,
    Letters,
    Digits,
    Unrecognized
}

export interface FormatContextData {
    /**
     * A single indent.
     */
    singleIndent?: string;

    /**
     * The number of spaces that make up a tab indent.
     */
    tabLength?: number;

    /**
     * The current indentation of the segment being formatted.
     */
    currentIndent?: string;

    /**
     * The string that will be used for a newline.
     */
    newline?: string;

    currentColumnIndex?: number;

    alignAttributes?: boolean;
}

export class FormatContext {
    private _indentStack = new qub.Stack<string>();

    constructor(private _data?: FormatContextData) {
        if (!_data) {
            _data = {};
            this._data = _data;
        }

        if (!qub.isDefined(_data.alignAttributes)) {
            _data.alignAttributes = false;
        }

        if (!_data.newline) {
            _data.newline = "\n";
        }

        if (!_data.singleIndent) {
            _data.singleIndent = "  ";
        }

        if (!qub.isDefined(_data.tabLength)) {
            _data.tabLength = 2;
        }

        if (!qub.isDefined(_data.currentIndent)) {
            _data.currentIndent = "";
        }
        else {
            this._indentStack.push(_data.currentIndent)
        }

        if (!qub.isDefined(_data.currentColumnIndex)) {
            _data.currentColumnIndex = 0;
        }
    }

    public get data(): FormatContextData {
        return this._data;
    }

    public get singleIndent(): string {
        return this._data.singleIndent;
    }

    public get tabLength(): number {
        return this._data.tabLength;
    }

    public get newLine(): string {
        return this._data.newline;
    }

    public get currentIndent(): string {
        return this._data.currentIndent;
    }

    public pushNewIndent(newIndent?: string): void {
        if (!qub.isDefined(newIndent)) {
            newIndent = this.currentIndent + this.singleIndent;
        }
        this._indentStack.push(newIndent);
        this._data.currentIndent = newIndent;
    }

    public popIndent(): void {
        this._indentStack.pop();
        this._data.currentIndent = this._indentStack.any() ? this._indentStack.peek() : "";
    }

    public get currentColumnIndex(): number {
        return this._data.currentColumnIndex;
    }

    public set currentColumnIndex(value: number) {
        this._data.currentColumnIndex = value;
    }

    public get alignAttributes(): boolean {
        return this._data.alignAttributes;
    }

    /**
     * Update this FormatContext's data based on the provided formatted string.
     * @param formattedString A small section of a larger formatted string.
     */
    public update(formattedString: string): string {
        if (formattedString) {
            const formattedStringLength: number = formattedString.length;
            for (let i = 0; i < formattedStringLength; ++i) {
                if (formattedString[i] === "\n") {
                    this._data.currentColumnIndex = 0;
                }
                else if (formattedString[i] === "\t") {
                    this._data.currentColumnIndex += this.tabLength;
                }
                else {
                    this._data.currentColumnIndex++;
                }
            }
        }
        return formattedString;
    }
}

export function initializeContext(context: FormatContext | FormatContextData): FormatContext {
    let result: FormatContext;

    if (!context) {
        result = new FormatContext();
    }
    else if (context instanceof FormatContext) {
        result = context;
    }
    else {
        result = new FormatContext(context);
    }

    return result;
}

export abstract class Segment {
    constructor(private _startIndex: number) {
    }

    public get span(): qub.Span {
        return new qub.Span(this._startIndex, this.getLength());
    }

    public get startIndex(): number {
        return this._startIndex;
    }

    public get afterEndIndex(): number {
        return this._startIndex + this.getLength();
    }

    /**
     * Get whether this Segment contains the provided character index or not.
     */
    public abstract containsIndex(index: number): boolean;

    /**
     * Get the string representation of this Segment.
     */
    public abstract toString(): string;

    /**
     * Get the length of the text of this segment.
     */
    public abstract getLength(): number;

    /**
     * Get the formatted string version of this Token.
     */
    public format(formatContext?: FormatContextData | FormatContext): string {
        const context: FormatContext = initializeContext(formatContext);
        return context.update(this.toString());
    }
}

export class Lex extends Segment {
    constructor(private _text: string, startIndex: number, private _type: LexType) {
        super(startIndex);
    }

    public containsIndex(index: number): boolean {
        return this.startIndex <= index && index <= this.afterEndIndex;
    }

    public toString(): string {
        return this._text;
    }

    public getType(): LexType {
        return this._type;
    }

    public getLength(): number {
        return qub.getLength(this._text);
    }
}

export function LeftAngleBracket(startIndex: number): Lex {
    return new Lex("<", startIndex, LexType.LeftAngleBracket);
}

export function RightAngleBracket(startIndex: number): Lex {
    return new Lex(">", startIndex, LexType.RightAngleBracket);
}

export function LeftSquareBracket(startIndex: number): Lex {
    return new Lex("[", startIndex, LexType.LeftSquareBracket);
}

export function RightSquareBracket(startIndex: number): Lex {
    return new Lex("]", startIndex, LexType.RightSquareBracket);
}

export function ExclamationPoint(startIndex: number): Lex {
    return new Lex("!", startIndex, LexType.ExclamationPoint);
}

export function QuestionMark(startIndex: number): Lex {
    return new Lex("?", startIndex, LexType.QuestionMark);
}

export function Dash(startIndex: number): Lex {
    return new Lex("-", startIndex, LexType.Dash);
}

export function SingleQuote(startIndex: number): Lex {
    return new Lex(`'`, startIndex, LexType.SingleQuote);
}

export function DoubleQuote(startIndex: number): Lex {
    return new Lex(`"`, startIndex, LexType.DoubleQuote);
}

export function Equals(startIndex: number): Lex {
    return new Lex("=", startIndex, LexType.Equals);
}

export function Underscore(startIndex: number): Lex {
    return new Lex("_", startIndex, LexType.Underscore);
}

export function Period(startIndex: number): Lex {
    return new Lex(".", startIndex, LexType.Period);
}

export function Colon(startIndex: number): Lex {
    return new Lex(":", startIndex, LexType.Colon);
}

export function Semicolon(startIndex: number): Lex {
    return new Lex(";", startIndex, LexType.Semicolon);
}

export function Ampersand(startIndex: number): Lex {
    return new Lex("&", startIndex, LexType.Ampersand);
}

export function ForwardSlash(startIndex: number): Lex {
    return new Lex("/", startIndex, LexType.ForwardSlash);
}

export function Whitespace(text: string, startIndex: number): Lex {
    return new Lex(text, startIndex, LexType.Whitespace);
}

export function NewLine(text: string, startIndex: number): Lex {
    return new Lex(text, startIndex, LexType.NewLine);
}

export function Letters(text: string, startIndex: number): Lex {
    return new Lex(text, startIndex, LexType.Letters);
}

export function Digits(text: string, startIndex: number): Lex {
    return new Lex(text, startIndex, LexType.Digits);
}

export function Unrecognized(text: string, startIndex: number): Lex {
    return new Lex(text, startIndex, LexType.Unrecognized);
}

/**
 * Get whether or not the provided Lex is a quote.
 */
export function isQuote(lex: Lex): boolean {
    return lex && (lex.getType() === LexType.SingleQuote || lex.getType() === LexType.DoubleQuote);
}

/**
 * A Lexer that converts basic Tokens from a qub.Tokenizer into XML Lexes that will be consumed by
 * the XML Tokenizer.
 */
export class Lexer extends qub.IteratorBase<Lex> {
    private _basicTokenizer: qub.Lexer;
    private _currentBasicTokenStartIndex: number;

    private _currentLex: Lex;
    private _currentLexStartIndex: number;

    constructor(text: string, startIndex: number = 0) {
        super();

        this._basicTokenizer = new qub.Lexer(text, startIndex);
        this._currentBasicTokenStartIndex = startIndex;
        this._currentLexStartIndex = startIndex;
    }

    public hasStarted(): boolean {
        return this._basicTokenizer.hasStarted();
    }

    public hasCurrent(): boolean {
        return !!this._currentLex;
    }

    public getCurrent(): Lex {
        return this._currentLex;
    }

    /**
     * Get whether the basic tokenizer currently points to a basic token or not.
     */
    private hasCurrentQubLex(): boolean {
        return this._basicTokenizer.hasCurrent();
    }

    /**
     * Get the current basic Token that the basic tokenizer is pointing at.
     */
    private getCurrentQubLex(): qub.Lex {
        return this._basicTokenizer.getCurrent();
    }

    /**
     * Move the basic tokenizer to the next token in its stream.
     */
    private nextQubLex(): boolean {
        if (this.hasCurrentQubLex()) {
            this._currentBasicTokenStartIndex += this.getCurrentQubLex().getLength();
        }

        return this._basicTokenizer.next();
    }

    /**
     * Read the XML Whitespace Token that the basic tokenizer is currently pointing at. The basic
     * tokenizer must currently be at a Space, Tab, or Carriage return basic token.
     */
    private readWhitespace(): Lex {
        const whitespaceStartIndex: number = this._currentBasicTokenStartIndex;
        let whitespaceText: string = this.getCurrentQubLex().toString();

        while (this.nextQubLex() &&
            (this.getCurrentQubLex().getType() === qub.LexType.Space ||
                this.getCurrentQubLex().getType() === qub.LexType.Tab ||
                this.getCurrentQubLex().getType() === qub.LexType.CarriageReturn)) {
            whitespaceText += this.getCurrentQubLex().toString();
        }

        return Whitespace(whitespaceText, whitespaceStartIndex);
    }

    /**
     * Move this Subtokenizer to the next XML Token in the stream.
     */
    public next(): boolean {
        if (!this.hasStarted()) {
            this.nextQubLex();
        }

        if (!this.hasCurrentQubLex()) {
            this._currentLex = undefined;
        }
        else {
            switch (this.getCurrentQubLex().getType()) {
                case qub.LexType.LeftAngleBracket:
                    this._currentLex = LeftAngleBracket(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.RightAngleBracket:
                    this._currentLex = RightAngleBracket(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.LeftSquareBracket:
                    this._currentLex = LeftSquareBracket(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.RightSquareBracket:
                    this._currentLex = RightSquareBracket(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.QuestionMark:
                    this._currentLex = QuestionMark(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.ExclamationPoint:
                    this._currentLex = ExclamationPoint(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Dash:
                    this._currentLex = Dash(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.SingleQuote:
                    this._currentLex = SingleQuote(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.DoubleQuote:
                    this._currentLex = DoubleQuote(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.EqualsSign:
                    this._currentLex = Equals(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Underscore:
                    this._currentLex = Underscore(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Period:
                    this._currentLex = Period(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Colon:
                    this._currentLex = Colon(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Semicolon:
                    this._currentLex = Semicolon(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Ampersand:
                    this._currentLex = Ampersand(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.ForwardSlash:
                    this._currentLex = ForwardSlash(this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Space:
                case qub.LexType.Tab:
                case qub.LexType.CarriageReturn:
                    this._currentLex = this.readWhitespace();
                    break;

                case qub.LexType.NewLine:
                    this._currentLex = NewLine(this.getCurrentQubLex().toString(), this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Letters:
                    this._currentLex = Letters(this.getCurrentQubLex().toString(), this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                case qub.LexType.Digits:
                    this._currentLex = Digits(this.getCurrentQubLex().toString(), this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;

                default:
                    this._currentLex = Unrecognized(this.getCurrentQubLex().toString(), this._currentBasicTokenStartIndex);
                    this.nextQubLex();
                    break;
            }
        }

        return this.hasCurrent();
    }
}

/**
 * A group of XML segments.
 */
export abstract class SegmentGroup extends Segment {
    constructor(private _segments: qub.Indexable<Segment>) {
        super(_segments.first().startIndex);
    }

    public get segments(): qub.Indexable<Segment> {
        return this._segments;
    }

    public getLength(): number {
        return qub.getContiguousLength(this._segments);
    }

    public toString(): string {
        return qub.getCombinedText(this._segments);
    }
}

/**
 * A XML quoted string (either double or single quoted).
 */
export class QuotedString extends Segment {
    constructor(private _lexes: qub.Iterable<Lex>) {
        super(_lexes.first().startIndex);
    }

    /**
     * Get each of the lexes that make up this QuotedString, including the start and end quotes.
     */
    public get lexes(): qub.Iterable<Lex> {
        return this._lexes;
    }

    /**
     * Get each of the lexes that make up this QuotedString, excluding the start and end quotes.
     */
    public get unquotedLexes(): qub.Iterable<Lex> {
        let result: qub.Iterable<Lex> = this._lexes.skip(1);

        if (this.hasEndQuote()) {
            result = result.skipLast(1);
        }

        return result;
    }

    public getLength(): number {
        return qub.getContiguousLength(this._lexes);
    }

    public toString(): string {
        return qub.getCombinedText(this._lexes);
    }

    /**
     * Get the start quote for this QuotedString.
     */
    public get startQuote(): Lex {
        return this.lexes.first();
    }

    /**
     * Get whether or not this QuotedString has an end quote.
     */
    public hasEndQuote(): boolean {
        let result: boolean = false;
        if (this.lexes && this.lexes.getCount() >= 2) {
            result = this.lexes.last().getType() === this.startQuote.getType();
        }
        return result;
    }

    /**
     * Get the string value of this QuotedString without the surrounding quotes.
     */
    public get unquotedString(): string {
        return this.toString().substr(1, this.getLength() - (this.hasEndQuote() ? 2 : 1));
    }

    public containsIndex(index: number): boolean {
        return this.startIndex < index && (!this.hasEndQuote() || index < this.afterEndIndex);
    }
}

/**
 * Check if the provided Names or strings have the same value based on XML name equality. This means
 * that the names will be the case-insensitive equal.
 * @param lhs The first Name or string to compare.
 * @param rhs The second Name or string to compare.
 */
export function matches(lhs: Name | string, rhs: Name | string): boolean {
    return lhs && rhs ? qub.toLowerCase(lhs.toString()) === qub.toLowerCase(rhs.toString()) : false;
}

/**
 * An XML Name that can be used as a Tag's name or as an Attribute's name.
 */
export class Name extends SegmentGroup {
    constructor(lexes: qub.Indexable<Lex>) {
        super(lexes);
    }

    public containsIndex(index: number): boolean {
        return this.startIndex <= index && index <= this.afterEndIndex;
    }

    public matches(name: Name | string): boolean {
        return matches(this, name);
    }
}

/**
 * An attribute within an XML declaration or tag.
 */
export class Attribute extends SegmentGroup {
    constructor(values: qub.Indexable<Segment>) {
        super(values);
    }

    /**
     * Get the name of this XML attribute. If no name is defined, then undefined will be returned.
     */
    public get name(): Name {
        const firstValue: Segment = this.segments.first();
        return firstValue instanceof Name ? firstValue : undefined;
    }

    /**
     * Get the equals sign in this XML attribute. If no equals sign is defined, then undefined will
     * be returned.
     */
    public get equals(): Lex {
        let equals: Lex = undefined;
        for (const segment of this.segments) {
            if (segment instanceof Lex && segment.getType() === LexType.Equals) {
                equals = segment;
                break;
            }
        }
        return equals;
    }

    /**
     * Get the value of this XML attribute. If no value is defined, then undefined will be returned.
     */
    public get value(): QuotedString {
        const lastValue: Segment = this.segments.last();
        return lastValue instanceof QuotedString ? lastValue : undefined;
    }

    /**
     * Get whether the provided index is contained by this XML attribute.
     */
    public containsIndex(index: number): boolean {
        let result: boolean = false;
        if (this.startIndex <= index) {
            for (const segment of this.segments.iterateReverse()) {
                if (segment instanceof QuotedString) {
                    result = !segment.hasEndQuote() || index < segment.afterEndIndex;
                    break;
                }
                else if (!(segment instanceof Lex) || segment.getType() !== LexType.Whitespace) {
                    result = index <= segment.afterEndIndex;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Get the formatted string representation of this XML attribute.
     */
    public format(context: FormatContext): string {
        context = initializeContext(context);

        let result: string = "";
        let previousSegmentWasNewLine: boolean = false;
        for (const segment of this.segments) {
            if (segment instanceof Lex && segment.getType() === LexType.NewLine) {
                previousSegmentWasNewLine = true;

                result += segment.format(context);
            }
            else if (!(segment instanceof Lex) || (segment.getType() !== LexType.Whitespace)) {
                if (previousSegmentWasNewLine) {
                    previousSegmentWasNewLine = false;
                    result += context.update(context.currentIndent);
                }

                result += segment.format(context);
            }
        }
        return result;
    }
}

/**
 * A generic XML tag class.
 */
export abstract class Tag extends SegmentGroup {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the left angle bracket token for this Tag.
     */
    public get leftAngleBracket(): Lex {
        return this.segments.first() as Lex;
    }

    /**
     * Get the right angle bracket token for this Tag.
     */
    public getRightAngleBracket(): Lex {
        let result: Lex = undefined;

        const lastSegment: Segment = this.segments.last();
        if (lastSegment instanceof Lex && lastSegment.getType() === LexType.RightAngleBracket) {
            result = lastSegment;
        }

        return result;
    }

    /**
     * Get whether this Tag contains the provided index.
     */
    public containsIndex(index: number): boolean {
        let result: boolean = false;

        if (this.startIndex < index) {
            const rightAngleBracket: Lex = this.getRightAngleBracket();
            result = !rightAngleBracket || index <= rightAngleBracket.startIndex;
        }

        return result;
    }

    /**
     * Get the formatted string representation of this Tag.
     */
    public format(context: FormatContext): string {
        context = initializeContext(context);

        let result: string = "";

        if (!context.alignAttributes) {
            context.pushNewIndent();
        }

        let previousSegmentWasWhitespace: boolean = false;
        let previousSegmentWasNewLine: boolean = false;
        let setAlignAttributeIndentation: boolean = false;
        for (const segment of this.segments) {
            if (segment instanceof Lex && segment.getType() === LexType.Whitespace) {
                previousSegmentWasWhitespace = !previousSegmentWasNewLine;
            }
            else if (segment instanceof Lex && segment.getType() == LexType.NewLine) {
                previousSegmentWasWhitespace = false;
                previousSegmentWasNewLine = true;

                result += segment.format(context);
            }
            else {
                if (previousSegmentWasWhitespace && !(segment instanceof Lex && segment.getType() === LexType.RightAngleBracket)) {
                    result += context.update(" ");
                }
                else if (previousSegmentWasNewLine) {
                    result += context.update(context.currentIndent);
                }

                if (!setAlignAttributeIndentation && context.alignAttributes && segment instanceof Attribute) {
                    let newIndent: string = "";
                    let newIndentColumnCount: number = 0;

                    if (context.singleIndent === "\t") {
                        const tabsToAdd: number = Math.floor(context.currentColumnIndex / context.tabLength);
                        newIndent += qub.repeat("\t", tabsToAdd);
                        newIndentColumnCount += tabsToAdd * context.tabLength;
                    }

                    if (newIndentColumnCount < context.currentColumnIndex) {
                        newIndent += qub.repeat(" ", context.currentColumnIndex - newIndentColumnCount);
                    }

                    context.pushNewIndent(newIndent);
                    setAlignAttributeIndentation = true;
                }

                result += segment.format(context);

                previousSegmentWasWhitespace = false;
                previousSegmentWasNewLine = false;
            }
        }

        context.popIndent();

        return result;
    }
}

export abstract class TagWithAttributes extends Tag {
    constructor(values: qub.Indexable<Segment>) {
        super(values);
    }

    /**
     * Get this Tag's name. If no name is defined, undefined will be returned.
     */
    public abstract getName(): Name;

    /**
     * Get the attributes in this Tag.
     */
    public get attributes(): qub.Iterable<Attribute> {
        return this.segments
            .where((segment: Segment) => segment instanceof Attribute)
            .map((segment: Segment) => segment as Attribute);
    }
}

export class Declaration extends TagWithAttributes {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    public get leftQuestionMark(): Lex {
        return this.segments.get(1) as Lex;
    }

    /**
     * Get the name of this Declaration.
     */
    public getName(): Name {
        const thirdSegment: Segment = this.segments.get(2);
        return thirdSegment instanceof Name ? thirdSegment : undefined;
    }

    /**
     * Get the attributes of this Declaration.
     */
    public get attributes(): qub.Iterable<Attribute> {
        return this.segments
            .where((segment: Segment) => segment instanceof Attribute)
            .map((segment: Segment) => segment as Attribute);
    }

    /**
     * Get the version attribute of this Declaration.
     */
    public get version(): Attribute {
        return this.attributes.first((attribute: Attribute) => attribute.name.toString() === "version");
    }

    /**
     * Get the encoding attribute of this Declaration.
     */
    public get encoding(): Attribute {
        return this.attributes.first((attribute: Attribute) => attribute.name.toString() === "encoding");
    }

    /**
     * Get the standalone attribute of this Declaration.
     */
    public get standalone(): Attribute {
        return this.attributes.first((attribute: Attribute) => attribute.name.toString() === "standalone");
    }

    public get rightQuestionMark(): Lex {
        let result: Lex;
        for (const segment of this.segments.skip(2).iterateReverse()) {
            if (segment instanceof Lex && segment.getType() === LexType.QuestionMark) {
                result = segment;
                break;
            }
        }
        return result;
    }
}

export class StartTag extends TagWithAttributes {
    constructor(values: qub.Indexable<Segment>) {
        super(values);
    }

    public getName(): Name {
        return this.segments.get(1) as Name;
    }
}

export class EndTag extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    public get forwardSlash(): Lex {
        return this.segments.get(1) as Lex;
    }

    public get name(): Name {
        let name: Name;

        const thirdSegment: Segment = this.segments.get(2);
        if (thirdSegment instanceof Name) {
            name = thirdSegment;
        }

        return name;
    }
}

export class EmptyElement extends TagWithAttributes {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    public getName(): Name {
        return this.segments.get(1) as Name;
    }

    /**
     * Get the forward slash Lex of this EmptyElement.
     */
    public get forwardSlash(): Lex {
        return this.segments.last((segment: Segment) => segment instanceof Lex && segment.getType() === LexType.ForwardSlash) as Lex;
    }
}

export class UnrecognizedTag extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }
}

/**
 * An document type definition that is defined within an XML document's DOCTYPE tag.
 */
export class InternalDefinition extends SegmentGroup {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the opening left square bracket ('[') of this internal document type definition.
     */
    public get leftSquareBracket(): Lex {
        return this.segments.first() as Lex;
    }

    /**
     * Get the closing right square bracket (']') of this internal document type definition.
     */
    public get rightSquareBracket(): Lex {
        let result: Lex;
        const lastSegment: Segment = this.segments.last();
        if (lastSegment instanceof Lex && lastSegment.getType() === LexType.RightSquareBracket) {
            result = lastSegment;
        }
        return result;
    }

    /**
     * Get whether or not this internal document type definition contains the provided index inside
     * the XML common.
     */
    public containsIndex(index: number): boolean {
        return this.startIndex < index && (!this.rightSquareBracket || index < this.rightSquareBracket.afterEndIndex);
    }
}

export class DOCTYPE extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the document type declaration's name segment ('DOCTYPE').
     */
    public get name(): Segment {
        return this.segments.get(2);
    }
}

export class Comment extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the segments that are contained by this Comment segment.
     */
    public get contentSegments(): qub.Iterable<Segment> {
        let result: qub.Iterable<Segment> = this.segments.skip(4);
        if (this.isClosed()) {
            result = result.skipLast(3);
        }
        return result;
    }

    /**
     * Get the text that is contained by this Comment segment.
     */
    public get contentText(): string {
        return qub.getCombinedText(this.contentSegments);
    }

    public getRightAngleBracket(): Lex {
        return this.isClosed() ? super.getRightAngleBracket() : undefined;
    }

    public isClosed(): boolean {
        return this.segments && this.segments.getCount() >= 7 && qub.getCombinedText(this.segments.takeLast(3)) === "-->" ? true : false;
    }

    public format(formatContext: FormatContext): string {
        const context: FormatContext = initializeContext(formatContext);
        return context.update(this.toString());
    }

    /**
     * Get whether this Comment contains the provided index.
     */
    public containsIndex(index: number): boolean {
        return this.startIndex < index && (!this.isClosed() || index < this.segments.last().afterEndIndex);
    }
}

/**
 * A ProcessingInstruction is a tag that is meant for the application that parses the XML Document.
 * It doesn't contribute to the XML Document's element content, but rather adds information/context
 * about how the element content should be parsed/used.
 * See http://www.com/axml/target.html#sec-pi for more information.
 */
export class ProcessingInstruction extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the name of this ProcessingInstruction.
     */
    public get name(): Name {
        let result: Name;

        const thirdSegment: Segment = this.segments.get(2);
        if (thirdSegment instanceof Name) {
            result = thirdSegment;
        }

        return result;
    }
}

export class CDATA extends Tag {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the segments that are contained by this CDATA segment.
     */
    public get dataSegments(): qub.Iterable<Segment> {
        let result: qub.Iterable<Segment> = this.segments.skip(5);
        if (this.isClosed()) {
            result = result.skipLast(3);
        }
        return result;
    }

    public getRightAngleBracket(): Lex {
        return this.isClosed() ? super.getRightAngleBracket() : undefined;
    }

    public isClosed(): boolean {
        return this.segments && this.segments.any() && qub.getCombinedText(this.segments.takeLast(3)) === "]]>" ? true : false;
    }
}

/**
 * A sequence of characters in an XML document that are not part of an XML tag.
 */
export class Text extends SegmentGroup {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    /**
     * Get the span of the characters in this Text that are not whitespace. If this Text is nothing
     * but whitespace, then undefined will be returned.
     */
    public get nonWhitespaceSpan(): qub.Span {
        let result: qub.Span;

        const nonWhitespaceLex = (segment: Segment) => segment instanceof Lex && segment.getType() !== LexType.Whitespace;

        const firstNonWhitespaceSegment: Segment = this.segments.first(nonWhitespaceLex);
        if (firstNonWhitespaceSegment) {
            const lastNonWhitespaceSegment = this.segments.last(nonWhitespaceLex);
            const startIndex: number = firstNonWhitespaceSegment.startIndex;
            result = new qub.Span(startIndex, lastNonWhitespaceSegment.afterEndIndex - startIndex);
        }

        return result;
    }

    /**
     * Get whether or not this Text segment contains any non-whitespace Lexes.
     */
    public isWhitespace(): boolean {
        return !this.segments.any((lex: Lex) =>
            lex.getType() !== LexType.Whitespace &&
            lex.getType() !== LexType.NewLine);
    }

    public format(formatContext: FormatContext): string {
        const context: FormatContext = initializeContext(formatContext);
        return context.update(this.toString().trim());
    }

    public containsIndex(index: number): boolean {
        return this.startIndex <= index && index <= this.afterEndIndex;
    }
}

export class Issues {
    public static missingAttributeEqualsSign(span: qub.Span): qub.Issue {
        return qub.Error(`Missing attribute's equals sign ('=').`, span);
    }

    public static expectedAttributeEqualsSign(span: qub.Span): qub.Issue {
        return qub.Error("Expected attribute's equals sign ('=').", span);
    }

    public static missingAttributeValue(span: qub.Span): qub.Issue {
        return qub.Error(`Missing attribute's quoted string value.`, span);
    }

    public static expectedAttributeValue(span: qub.Span): qub.Issue {
        return qub.Error(`Expected attribute's quoted string value.`, span);
    }

    public static missingQuotedStringEndQuote(span: qub.Span): qub.Issue {
        return qub.Error(`Missing quoted string's end quote.`, span);
    }

    public static missingStartTagRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing start tag's closing right angle bracket ('>').`, span);
    }

    public static missingEmptyElementRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing empty element's closing right angle bracket ('>').`, span);
    }

    public static expectedWhitespaceBetweenAttributes(span: qub.Span): qub.Issue {
        return qub.Error(`Expected whitespace between attributes.`, span);
    }

    public static expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(span: qub.Span): qub.Issue {
        return qub.Error(`Expected whitespace, start tag's closing right angle bracket ('>'), or empty element's forward slash ('/').`, span);
    }

    public static expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(span: qub.Span): qub.Issue {
        return qub.Error(`Expected attribute name, start tag's closing right angle bracket ('>'), or empty element's forward slash ('/').`, span);
    }

    public static expectedEmptyElementRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected empty element's closing right angle bracket ('>').`, span);
    }

    public static missingEndTagName(span: qub.Span): qub.Issue {
        return qub.Error(`Missing end tag's name.`, span);
    }

    public static expectedEndTagName(span: qub.Span): qub.Issue {
        return qub.Error(`Expected end tag's name.`, span);
    }

    public static missingEndTagRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing end tag's closing right angle bracket ('>').`, span);
    }

    public static expectedEndTagRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected end tag's closing right angle bracket ('>').`, span);
    }

    public static missingTagRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing tag's closing right angle bracket ('>').`, span);
    }

    public static expectedProcessingInstructionRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected processing instruction's closing right angle bracket ('>').`, span);
    }

    public static expectedProcessingInstructionRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Expected processing instruction's closing right question mark ('?').`, span);
    }

    public static missingProcessingInstructionRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing processing instruction's closing right angle bracket ('>').`, span);
    }

    public static missingProcessingInstructionRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Missing processing instruction's closing right question mark ('?').`, span);
    }

    public static expectedDeclarationRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's closing right question mark ('?').`, span);
    }

    public static expectedDeclarationRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's closing right angle bracket ('>').`, span);
    }

    public static missingDeclarationRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Missing declaration's closing right question mark ('?').`, span);
    }

    public static missingDeclarationRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing declaration's closing right angle bracket ('>').`, span);
    }

    public static expectedDeclarationVersionAttribute(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's version attribute ('version="1.0"').`, span);
    }

    public static invalidDeclarationVersionAttributeValue(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's version attribute value to be "1.0".`, span);
    }

    public static expectedDeclarationEncodingOrStandaloneAttribute(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's encoding attribute ('encoding="utf-8"') or standalone attribute ('standalone="yes"').`, span);
    }

    public static expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's encoding attribute ('encoding="utf-8"'), standalone attribute ('standalone="yes"'), or closing right question mark ('?').`, span);
    }

    public static expectedDeclarationStandaloneAttribute(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's standalone attribute ('standalone="yes"').`, span);
    }

    public static expectedDeclarationStandaloneAttributeOrRightQuestionMark(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's standalone attribute ('standalone="yes"') or closing right question mark ('?').`, span);
    }

    public static invalidDeclarationStandaloneAttributeValue(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's standalone attribute value to be "yes" or "no".`, span);
    }

    public static missingDeclarationVersionAttribute(span: qub.Span): qub.Issue {
        return qub.Error(`Missing declaration's version attribute ('version="1.0"').`, span);
    }

    public static missingInternalDefinitionRightSquareBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing internal document type definition's closing right square bracket (']').`, span);
    }

    public static missingDOCTYPERootElementName(span: qub.Span): qub.Issue {
        return qub.Error(`Missing DOCTYPE's root element name.`, span);
    }

    public static expectedDOCTYPERootElementName(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE's root element name.`, span);
    }

    public static missingDOCTYPERightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing DOCTYPE's closing right angle bracket ('>').`, span);
    }

    public static invalidDOCTYPEExternalIdType(span: qub.Span): qub.Issue {
        return qub.Error(`A DOCTYPE's external ID type must be either 'SYSTEM' or 'PUBLIC'.`, span);
    }

    public static missingDOCTYPESystemIdentifier(span: qub.Span): qub.Issue {
        return qub.Error(`Missing DOCTYPE's system identifier (quoted-string).`, span);
    }

    public static expectedDOCTYPESystemIdentifier(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE's system identifier (quoted-string).`, span);
    }

    public static missingDOCTYPEPublicIdentifier(span: qub.Span): qub.Issue {
        return qub.Error(`Missing DOCTYPE's public identifier (quoted-string).`, span);
    }

    public static expectedDOCTYPEPublicIdentifier(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE's public identifier (quoted-string).`, span);
    }

    public static expectedDOCTYPEExternalIdTypeInternalDefinitionOrRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE's external ID type ('PUBLIC' or 'SYSTEM'), internal definition, or closing right angle bracket ('>').`, span);
    }

    public static expectedDOCTYPERightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE's closing right angle bracket ('>').`, span);
    }

    public static missingCommentSecondStartDash(span: qub.Span): qub.Issue {
        return qub.Error(`Missing comment's second start dash ('-').`, span);
    }

    public static expectedCommentSecondStartDash(span: qub.Span): qub.Issue {
        return qub.Error(`Expected comment's second start dash ('-').`, span);
    }

    public static missingCommentClosingDashes(span: qub.Span): qub.Issue {
        return qub.Error(`Missing comment's closing dashes ('--').`, span);
    }

    public static missingCommentSecondClosingDash(span: qub.Span): qub.Issue {
        return qub.Error(`Missing comment's second closing dash ('-').`, span);
    }

    public static missingCommentRightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing comment's closing right angle bracket ('>').`, span);
    }

    public static missingCDATAName(span: qub.Span): qub.Issue {
        return qub.Error(`Missing CDATA tag's name ('CDATA').`, span);
    }

    public static expectedCDATAName(span: qub.Span): qub.Issue {
        return qub.Error(`Expected CDATA tag's name ('CDATA').`, span);
    }

    public static missingCDATASecondLeftSquareBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing CDATA tag's second left square bracket ('[').`, span);
    }

    public static expectedCDATASecondLeftSquareBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected CDATA tag's second left square bracket ('[').`, span);
    }

    public static missingCDATARightSquareBrackets(span: qub.Span): qub.Issue {
        return qub.Error(`Missing CDATA tag's closing right square brackets (']]').`, span);
    }

    public static missingCDATASecondRightSquareBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing CDATA tag's second closing right square bracket (']').`, span);
    }

    public static missingCDATARightAngleBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Missing CDATA tag's closing right angle bracket ('>').`, span);
    }

    public static missingElementEndTag(span: qub.Span, expectedEndTagName: string): qub.Issue {
        return qub.Error(`Missing element's end tag ('</${expectedEndTagName}>').`, span);
    }

    public static expectedElementEndTagWithDifferentName(span: qub.Span, expectedEndTagName: string): qub.Issue {
        return qub.Error(`Expected end tag name to match start tag's name ('${expectedEndTagName}').`, span);
    }

    public static missingDocumentRootElement(): qub.Issue {
        return qub.Error(`Missing document's root element.`, new qub.Span(0, 0));
    }

    public static documentDeclarationMustBeFirstSegment(span: qub.Span): qub.Issue {
        return qub.Error(`If a declaration exists, it must be the first segment in the document.`, span);
    }

    public static documentCanHaveOneDeclaration(span: qub.Span): qub.Issue {
        return qub.Error(`An XML document can have only one declaration.`, span);
    }

    public static documentDOCTYPEMustBeAfterDeclaration(span: qub.Span): qub.Issue {
        return qub.Error(`If a document type declaration exists, it must come after the document's declaration.`, span);
    }

    public static documentCanHaveOneDOCTYPE(span: qub.Span): qub.Issue {
        return qub.Error(`An XML document can have only one document type declaration.`, span);
    }

    public static documentCannotHaveTextAtRootLevel(span: qub.Span): qub.Issue {
        return qub.Error(`An XML document cannot have non-whitespace text at its root level.`, span);
    }

    public static documentCanHaveOneRootElement(span: qub.Span): qub.Issue {
        return qub.Error(`An XML document can have only one root element.`, span);
    }

    public static documentCannotHaveCDATAAtRootLevel(span: qub.Span): qub.Issue {
        return qub.Error(`An XML document cannot have a CDATA tag at its root level.`, span);
    }

    public static expectedDOCTYPENameCommentDashesOrCDATALeftSquareBracket(span: qub.Span): qub.Issue {
        return qub.Error(`Expected DOCTYPE name ('DOCTYPE'), comment start dashes ('--'), or CDATA first left square bracket ('[').`, span);
    }

    public static missingNameQuestionMarkExclamationPointOrForwardSlash(span: qub.Span): qub.Issue {
        return qub.Error(`Missing name, question mark ('?'), exclamation point ('!'), or forward slash ('/').`, span);
    }

    public static expectedNameQuestionMarkExclamationPointOrForwardSlash(span: qub.Span): qub.Issue {
        return qub.Error(`Expected name, question mark ('?'), exclamation point ('!'), or forward slash ('/').`, span);
    }

    public static missingDeclarationOrProcessingInstructionName(span: qub.Span): qub.Issue {
        return qub.Error(`Missing declaration's or processing instruction's name.`, span);
    }

    public static expectedDeclarationOrProcessingInstructionName(span: qub.Span): qub.Issue {
        return qub.Error(`Expected declaration's or processing instruction's name.`, span);
    }
}

/**
 * An XML tokenizer that produces XML Segments.
 */
export class Tokenizer extends qub.IteratorBase<Segment> {
    private _lexer: Lexer;
    private _currentSegment: Segment;

    constructor(text: string, startIndex: number = 0, private _issues?: qub.ArrayList<qub.Issue>) {
        super();

        this._lexer = new Lexer(text, startIndex);
    }

    /**
     * Get whether or not this XML tokenizer started tokenizing the source text.
     */
    public hasStarted(): boolean {
        return this._lexer.hasStarted();
    }

    /**
     * Get whether or not this tokenizer has a current segment.
     */
    public hasCurrent(): boolean {
        return qub.isDefined(this._currentSegment);
    }

    /**
     * Get the current segment that this XML tokenizer is pointing at.
     */
    public getCurrent(): Segment {
        return this._currentSegment;
    }

    /**
     * Get whether the Lexer currently points to a Lex or not.
     */
    private hasCurrentLex(): boolean {
        return this._lexer.hasCurrent();
    }

    /**
     * Get the current Lex that the Lexer is pointing at.
     */
    private getCurrentLex(): Lex {
        return this._lexer.getCurrent();
    }

    /**
     * Move the Lexer to the next Lex in its stream.
     */
    private nextLex(): boolean {
        return this._lexer.next();
    }

    /**
     * Skip past any XML Whitespace or NewLine tokens that the tokenizer is currently at. If any
     * Whitespace or NewLine Lexes are encountered, then they will be placed into the provided
     * segments array.
     */
    private skipWhitespace(segments: qub.ArrayList<Segment>): void {
        while (this.hasCurrentLex() &&
            (this.getCurrentLex().getType() === LexType.Whitespace ||
                this.getCurrentLex().getType() === LexType.NewLine)) {
            segments.add(this.getCurrentLex());
            this.nextLex();
        }
    }

    private readName(): Name {
        const nameLexes = new qub.ArrayList([this.getCurrentLex()]);
        this.nextLex();

        while (this.hasCurrentLex() &&
            (this.getCurrentLex().getType() === LexType.Letters ||
                this.getCurrentLex().getType() === LexType.Digits ||
                this.getCurrentLex().getType() === LexType.Period ||
                this.getCurrentLex().getType() === LexType.Dash ||
                this.getCurrentLex().getType() === LexType.Underscore ||
                this.getCurrentLex().getType() === LexType.Colon)) {
            nameLexes.add(this.getCurrentLex());
            this.nextLex();
        }

        return new Name(nameLexes);
    }

    /**
     * Add an issue to this Tokenizer's list of issues. If this Tokenizer doesn't have a list
     * of issues, then this method will do nothing.
     */
    public addIssue(issue: qub.Issue): void {
        if (this._issues) {
            this._issues.add(issue);
        }
    }

    /**
     * Read an XML QuotedString Segment from the basic tokenizer. To call this method, the basic
     * tokenizer must be currently pointing at either a SingleQuote or DoubleQuote basic token.
     */
    private readQuotedString(): QuotedString {
        const startQuote: Lex = this.getCurrentLex();
        const segments = new qub.ArrayList([startQuote]);
        this.nextLex();

        let endQuote: Lex;
        while (!endQuote && this.hasCurrentLex()) {
            segments.add(this.getCurrentLex());
            if (this.getCurrentLex().getType() === startQuote.getType()) {
                endQuote = this.getCurrentLex();
            }
            this.nextLex();
        }

        return new QuotedString(segments);
    }

    /**
     * Read an XML Tag Attribute from the basic tokenizer. To call this method, the basic tokenizer
     * must be pointing at a Letters, Underscore, or Colon basic Token.
     */
    public readAttribute(tagSegments: qub.ArrayList<Segment>): Attribute {
        if (!this.hasStarted()) {
            this.nextLex();
        }

        const attributeName: Name = this.readName();
        if (tagSegments.any() && tagSegments.last() instanceof Attribute) {
            this.addIssue(Issues.expectedWhitespaceBetweenAttributes(attributeName.span));
        }

        const attributeSegments = new qub.ArrayList<Segment>([attributeName]);

        this.skipWhitespace(attributeSegments);

        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingAttributeEqualsSign(attributeName.span));
        }
        else if (this.getCurrentLex().getType() !== LexType.Equals) {
            this.addIssue(Issues.expectedAttributeEqualsSign(this.getCurrentLex().span));
        }
        else {
            attributeSegments.add(this.getCurrentLex());
            this.nextLex();

            this.skipWhitespace(attributeSegments);

            if (!this.hasCurrentLex()) {
                this.addIssue(Issues.missingAttributeValue(attributeName.span));
            }
            else if (!isQuote(this.getCurrentLex())) {
                this.addIssue(Issues.expectedAttributeValue(this.getCurrentLex().span));
            }
            else {
                const attributeValue: QuotedString = this.readQuotedString();
                if (!attributeValue.hasEndQuote()) {
                    this.addIssue(Issues.missingQuotedStringEndQuote(attributeValue.span));
                }
                attributeSegments.add(attributeValue);
            }
        }

        return new Attribute(attributeSegments);
    }

    /**
     * Read an XML StartTag or EmptyTag from the basic tokenizer. To call this method, the basic
     * tokenizer must be pointing at a Letters, Underscore, or Colon basic Token.
     */
    private readStartTagOrEmptyTag(tagSegments: qub.ArrayList<Segment>): StartTag {
        tagSegments.add(this.readName());

        let emptyElementForwardSlash: Lex;

        let rightAngleBracket: Lex;
        while (!rightAngleBracket && !emptyElementForwardSlash && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    tagSegments.add(this.readAttribute(tagSegments));
                    break;

                case LexType.ForwardSlash:
                    emptyElementForwardSlash = this.getCurrentLex();
                    tagSegments.add(emptyElementForwardSlash);
                    this.nextLex();
                    break;

                case LexType.Whitespace:
                case LexType.NewLine:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;

                default:
                    const lastSegment: Segment = tagSegments.last();
                    let currentSegment: Segment;
                    if (isQuote(this.getCurrentLex())) {
                        currentSegment = this.readQuotedString();
                    }
                    else {
                        currentSegment = this.getCurrentLex();
                        this.nextLex();
                    }

                    if (tagSegments.getCount() === 2) {
                        // If the tag segments is currently "<a", then we expect to find whitespace
                        // after the tag's name.
                        this.addIssue(Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(currentSegment.span));
                    }
                    else if (lastSegment instanceof Attribute && lastSegment.equals && lastSegment.value) {
                        this.addIssue(Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(currentSegment.span));
                    }
                    else if (!(lastSegment instanceof Attribute) || (lastSegment.equals && lastSegment.value)) {
                        this.addIssue(Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(currentSegment.span));
                    }

                    tagSegments.add(currentSegment);
                    break;
            }
        }

        if (emptyElementForwardSlash) {
            while (!rightAngleBracket && this.hasCurrentLex()) {
                switch (this.getCurrentLex().getType()) {
                    case LexType.RightAngleBracket:
                        rightAngleBracket = this.getCurrentLex();
                        tagSegments.add(rightAngleBracket);
                        this.nextLex();
                        break;

                    default:
                        let currentSegment: Segment;
                        if (isQuote(this.getCurrentLex())) {
                            currentSegment = this.readQuotedString();
                        }
                        else {
                            currentSegment = this.getCurrentLex();
                            this.nextLex();
                        }
                        this.addIssue(Issues.expectedEmptyElementRightAngleBracket(currentSegment.span));
                        tagSegments.add(currentSegment);
                        break;
                }
            }
        }

        if (!rightAngleBracket) {
            const leftAngleBracket: Segment = tagSegments.first();
            if (!emptyElementForwardSlash) {
                this.addIssue(Issues.missingStartTagRightAngleBracket(leftAngleBracket.span));
            }
            else {
                this.addIssue(Issues.missingEmptyElementRightAngleBracket(leftAngleBracket.span));
            }
        }

        return !emptyElementForwardSlash ? new StartTag(tagSegments) : new EmptyElement(tagSegments);
    }

    /**
     * Read an XML EndTag from the basic tokenizer. To call this method, the Lexer must be pointing
     * at the end tag's name.
     */
    private readEndTag(tagSegments: qub.ArrayList<Segment>): EndTag {
        let rightAngleBracket: Lex;
        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingEndTagName(tagSegments.last().span));
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    tagSegments.add(this.readName());
                    break;

                default:
                    this.addIssue(Issues.expectedEndTagName(this.getCurrentLex().span));
                    if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                        rightAngleBracket = this.getCurrentLex();
                    }
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        while (!rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                case LexType.Whitespace:
                case LexType.NewLine:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;

                default:
                    this.addIssue(Issues.expectedEndTagRightAngleBracket(this.getCurrentLex().span));
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        if (!rightAngleBracket) {
            this.addIssue(Issues.missingEndTagRightAngleBracket(tagSegments.first().span));
        }

        return new EndTag(tagSegments);
    }

    /**
     * Read an XML UnrecognizedTag from the basic tokenizer.
     */
    private readUnrecognizedTag(tagSegments: qub.ArrayList<Segment>): UnrecognizedTag {
        let rightAngleBracket: Lex;
        while (!rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                case LexType.SingleQuote:
                case LexType.DoubleQuote:
                    tagSegments.add(this.readQuotedString());
                    break;

                default:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        if (!rightAngleBracket) {
            this.addIssue(Issues.missingTagRightAngleBracket(tagSegments.first().span));
        }

        return new UnrecognizedTag(tagSegments);
    }

    /**
     * Read an XML ProcessingInstruction from the Lexer.
     */
    private readProcessingInstruction(tagSegments: qub.ArrayList<Segment>): UnrecognizedTag {
        let rightQuestionMark: Lex;
        let rightAngleBracket: Lex;
        while (!rightQuestionMark && !rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.QuestionMark:
                    rightQuestionMark = this.getCurrentLex();
                    tagSegments.add(rightQuestionMark);
                    this.nextLex();
                    break;

                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    this.addIssue(Issues.expectedProcessingInstructionRightQuestionMark(rightAngleBracket.span));
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                default:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        while (!rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                default:
                    this.addIssue(Issues.expectedProcessingInstructionRightAngleBracket(this.getCurrentLex().span));
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        if (!rightAngleBracket) {
            if (!rightQuestionMark) {
                this.addIssue(Issues.missingProcessingInstructionRightQuestionMark(tagSegments.get(1).span));
            }
            this.addIssue(Issues.missingProcessingInstructionRightAngleBracket(tagSegments.first().span));
        }

        return new ProcessingInstruction(tagSegments);
    }

    private readDeclaration(tagSegments: qub.ArrayList<Segment>): Declaration {
        this.skipWhitespace(tagSegments);

        let rightQuestionMark: Lex;
        let rightAngleBracket: Lex;

        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingDeclarationVersionAttribute(tagSegments.last().span));
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    const attribute: Attribute = this.readAttribute(tagSegments);
                    tagSegments.add(attribute);
                    if (attribute.name.toString() !== "version") {
                        this.addIssue(Issues.expectedDeclarationVersionAttribute(attribute.name.span));
                    }
                    else if (attribute.value && attribute.value.unquotedString !== "1.0") {
                        this.addIssue(Issues.invalidDeclarationVersionAttributeValue(attribute.value.span));
                    }
                    break;

                default:
                    let currentSegment: Segment;
                    if (isQuote(this.getCurrentLex())) {
                        currentSegment = this.readQuotedString();
                    }
                    else {
                        switch (this.getCurrentLex().getType()) {
                            case LexType.QuestionMark:
                                rightQuestionMark = this.getCurrentLex();
                                break;

                            case LexType.RightAngleBracket:
                                rightAngleBracket = this.getCurrentLex();
                                this.addIssue(Issues.expectedDeclarationRightQuestionMark(rightAngleBracket.span));
                                break;
                        }
                        currentSegment = this.getCurrentLex();
                        this.nextLex();
                    }

                    this.addIssue(Issues.expectedDeclarationVersionAttribute(currentSegment.span));

                    tagSegments.add(currentSegment);
                    break;
            }

            if (!rightQuestionMark && !rightAngleBracket && this.hasCurrentLex()) {
                this.skipWhitespace(tagSegments);

                let foundStandaloneAttribute: boolean;
                if (this.hasCurrentLex()) {
                    switch (this.getCurrentLex().getType()) {
                        case LexType.Letters:
                        case LexType.Underscore:
                        case LexType.Colon:
                            const attribute: Attribute = this.readAttribute(tagSegments);
                            tagSegments.add(attribute);
                            foundStandaloneAttribute = (attribute.name.toString() === "standalone");
                            if (attribute.name.toString() === "encoding") {
                                // Encoding attribute validations.
                            }
                            else if (attribute.name.toString() === "standalone") {
                                foundStandaloneAttribute = true;
                                if (attribute.value && attribute.value.unquotedString !== "yes" && attribute.value.unquotedString !== "no") {
                                    this.addIssue(Issues.invalidDeclarationStandaloneAttributeValue(attribute.value.span));
                                }
                            }
                            else {
                                this.addIssue(Issues.expectedDeclarationEncodingOrStandaloneAttribute(attribute.name.span));
                            }
                            break;

                        case LexType.QuestionMark:
                            rightQuestionMark = this.getCurrentLex();
                            tagSegments.add(rightQuestionMark);
                            this.nextLex();
                            break;

                        default:
                            let currentSegment: Segment;
                            if (isQuote(this.getCurrentLex())) {
                                currentSegment = this.readQuotedString();
                            }
                            else {
                                if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                                    rightAngleBracket = this.getCurrentLex();
                                }
                                currentSegment = this.getCurrentLex();
                                this.nextLex();
                            }
                            this.addIssue(Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(currentSegment.span));
                            tagSegments.add(currentSegment);
                            break;
                    }

                    if (!rightQuestionMark && !rightAngleBracket && this.hasCurrentLex() && !foundStandaloneAttribute) {
                        this.skipWhitespace(tagSegments);

                        if (this.hasCurrentLex()) {
                            switch (this.getCurrentLex().getType()) {
                                case LexType.Letters:
                                case LexType.Underscore:
                                case LexType.Colon:
                                    const attribute: Attribute = this.readAttribute(tagSegments);
                                    tagSegments.add(attribute);
                                    if (attribute.name.toString() !== "standalone") {
                                        this.addIssue(Issues.expectedDeclarationStandaloneAttribute(attribute.name.span));
                                    }
                                    else if (attribute.value && attribute.value.unquotedString !== "yes" && attribute.value.unquotedString !== "no") {
                                        this.addIssue(Issues.invalidDeclarationStandaloneAttributeValue(attribute.value.span));
                                    }
                                    break;

                                case LexType.QuestionMark:
                                    rightQuestionMark = this.getCurrentLex();
                                    tagSegments.add(rightQuestionMark);
                                    this.nextLex();
                                    break;

                                default:
                                    if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                                        rightAngleBracket = this.getCurrentLex();
                                    }
                                    tagSegments.add(this.getCurrentLex());
                                    this.addIssue(Issues.expectedDeclarationStandaloneAttributeOrRightQuestionMark(this.getCurrentLex().span));
                                    this.nextLex();
                                    break;
                            }
                        }
                    }
                }
            }
        }

        while (!rightQuestionMark && !rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.QuestionMark:
                    rightQuestionMark = this.getCurrentLex();
                    tagSegments.add(rightQuestionMark);
                    this.nextLex();
                    break;

                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.addIssue(Issues.expectedDeclarationRightQuestionMark(rightAngleBracket.span));
                    this.nextLex();
                    break;

                case LexType.Whitespace:
                case LexType.NewLine:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;

                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    const attribute: Attribute = this.readAttribute(tagSegments);
                    this.addIssue(Issues.expectedDeclarationRightQuestionMark(attribute.span));
                    tagSegments.add(attribute);
                    break;

                default:
                    tagSegments.add(this.getCurrentLex());
                    this.addIssue(Issues.expectedDeclarationRightQuestionMark(this.getCurrentLex().span));
                    this.nextLex();
                    break;
            }
        }

        while (this.hasCurrentLex() && !rightAngleBracket) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                default:
                    this.addIssue(Issues.expectedDeclarationRightAngleBracket(this.getCurrentLex().span));
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        if (!rightAngleBracket) {
            if (!rightQuestionMark) {
                this.addIssue(Issues.missingDeclarationRightQuestionMark(tagSegments.get(1).span));
            }
            this.addIssue(Issues.missingDeclarationRightAngleBracket(tagSegments.first().span));
        }

        return new Declaration(tagSegments);
    }

    /**
     * Read an internal document type definition from the Lexer. The Lexer must be pointing at the
     * internal document type definition's left square bracket when this function is called.
     */
    private readInternalDefinition(): InternalDefinition {
        const segments = new qub.ArrayList<Segment>([this.getCurrentLex()]);
        this.nextLex();

        let rightSquareBracket: Lex;
        while (!rightSquareBracket && this.hasCurrentLex()) {
            if (this.getCurrentLex().getType() === LexType.RightSquareBracket) {
                rightSquareBracket = this.getCurrentLex();
            }

            segments.add(this.getCurrentLex());
            this.nextLex();
        }

        if (!rightSquareBracket) {
            this.addIssue(Issues.missingInternalDefinitionRightSquareBracket(segments.first().span));
        }

        return new InternalDefinition(segments);
    }

    /**
     * Read a DOCTYPE tag from the subtokenizer. The subtokenizer must be pointing at the Token
     * after the DOCTYPE tag's name when this function is called.
     */
    private readDOCTYPE(tagSegments: qub.ArrayList<Segment>): DOCTYPE {
        this.skipWhitespace(tagSegments);

        let rightAngleBracket: Lex;
        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingDOCTYPERootElementName(tagSegments.get(2).span));
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    tagSegments.add(this.readName());
                    break;

                default:
                    let currentSegment: Segment;
                    if (isQuote(this.getCurrentLex())) {
                        currentSegment = this.readQuotedString();
                    }
                    else {
                        if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                            rightAngleBracket = this.getCurrentLex();
                        }
                        currentSegment = this.getCurrentLex();
                        this.nextLex();
                    }
                    this.addIssue(Issues.expectedDOCTYPERootElementName(currentSegment.span));
                    tagSegments.add(currentSegment);
                    break;
            }
        }

        if (!rightAngleBracket && this.hasCurrentLex()) {
            this.skipWhitespace(tagSegments);

            if (this.hasCurrentLex()) {
                switch (this.getCurrentLex().getType()) {
                    case LexType.RightAngleBracket:
                        rightAngleBracket = this.getCurrentLex();
                        tagSegments.add(rightAngleBracket);
                        this.nextLex();
                        break;

                    case LexType.SingleQuote:
                    case LexType.DoubleQuote:
                        tagSegments.add(this.readQuotedString());
                        break;

                    case LexType.Letters:
                        const externalIdType: Lex = this.getCurrentLex();
                        tagSegments.add(externalIdType);
                        this.nextLex();

                        this.skipWhitespace(tagSegments);

                        if (externalIdType.toString() === "SYSTEM") {
                            if (!this.hasCurrentLex()) {
                                this.addIssue(Issues.missingDOCTYPESystemIdentifier(externalIdType.span));
                            }
                            else if (!isQuote(this.getCurrentLex())) {
                                this.addIssue(Issues.expectedDOCTYPESystemIdentifier(this.getCurrentLex().span));
                                if (this.getCurrentLex().getType() !== LexType.LeftSquareBracket) {
                                    if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                                        rightAngleBracket = this.getCurrentLex();
                                    }
                                    tagSegments.add(this.getCurrentLex());
                                    this.nextLex();
                                }
                            }
                            else {
                                tagSegments.add(this.readQuotedString());
                            }
                        }
                        else if (externalIdType.toString() === "PUBLIC") {
                            if (!this.hasCurrentLex()) {
                                this.addIssue(Issues.missingDOCTYPEPublicIdentifier(externalIdType.span));
                            }
                            else if (!isQuote(this.getCurrentLex())) {
                                this.addIssue(Issues.expectedDOCTYPEPublicIdentifier(this.getCurrentLex().span));
                                if (this.getCurrentLex().getType() !== LexType.LeftSquareBracket) {
                                    if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                                        rightAngleBracket = this.getCurrentLex();
                                    }
                                    tagSegments.add(this.getCurrentLex());
                                    this.nextLex();
                                }
                            }
                            else {
                                const publicIdentifier: QuotedString = this.readQuotedString();
                                tagSegments.add(publicIdentifier);

                                this.skipWhitespace(tagSegments);

                                if (!this.hasCurrentLex()) {
                                    this.addIssue(Issues.missingDOCTYPESystemIdentifier(publicIdentifier.span));
                                }
                                else if (!isQuote(this.getCurrentLex())) {
                                    this.addIssue(Issues.expectedDOCTYPESystemIdentifier(this.getCurrentLex().span));
                                    if (this.getCurrentLex().getType() !== LexType.LeftSquareBracket) {
                                        if (this.getCurrentLex().getType() === LexType.RightAngleBracket) {
                                            rightAngleBracket = this.getCurrentLex();
                                        }
                                        tagSegments.add(this.getCurrentLex());
                                        this.nextLex();
                                    }
                                }
                                else {
                                    tagSegments.add(this.readQuotedString());
                                }
                            }
                        }
                        else {
                            this.addIssue(Issues.invalidDOCTYPEExternalIdType(externalIdType.span));
                        }

                        this.skipWhitespace(tagSegments);

                        if (this.hasCurrentLex() && this.getCurrentLex().getType() === LexType.LeftSquareBracket) {
                            tagSegments.add(this.readInternalDefinition());
                        }
                        break;

                    case LexType.LeftSquareBracket:
                        tagSegments.add(this.readInternalDefinition());
                        break;

                    default:
                        this.addIssue(Issues.expectedDOCTYPEExternalIdTypeInternalDefinitionOrRightAngleBracket(this.getCurrentLex().span));
                        tagSegments.add(this.getCurrentLex());
                        this.nextLex();
                        break;
                }
            }
        }

        while (!rightAngleBracket && this.hasCurrentLex()) {
            switch (this.getCurrentLex().getType()) {
                case LexType.RightAngleBracket:
                    rightAngleBracket = this.getCurrentLex();
                    tagSegments.add(rightAngleBracket);
                    this.nextLex();
                    break;

                case LexType.SingleQuote:
                case LexType.DoubleQuote:
                    tagSegments.add(this.readQuotedString());
                    break;

                case LexType.Whitespace:
                case LexType.NewLine:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;

                default:
                    this.addIssue(Issues.expectedDOCTYPERightAngleBracket(this.getCurrentLex().span));
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();
                    break;
            }
        }

        if (!rightAngleBracket) {
            this.addIssue(Issues.missingDOCTYPERightAngleBracket(tagSegments.first().span));
        }

        return new DOCTYPE(tagSegments);
    }

    /**
     * Read an XML Comment from the basic tokenizer. The basic tokenizer must be pointing at the
     * first start dash when this function is called.
     */
    private readComment(tagSegments: qub.ArrayList<Segment>): Tag {
        const firstStartDash: Lex = this.getCurrentLex();
        tagSegments.add(firstStartDash);
        this.nextLex();

        let result: Tag;
        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingCommentSecondStartDash(firstStartDash.span));
            result = this.readUnrecognizedTag(tagSegments);
        }
        else if (this.getCurrentLex().getType() !== LexType.Dash) {
            this.addIssue(Issues.expectedCommentSecondStartDash(this.getCurrentLex().span));
            result = this.readUnrecognizedTag(tagSegments);
        }
        else {
            tagSegments.add(this.getCurrentLex());
            this.nextLex();

            let closingDashCount: number = 0;
            let rightAngleBracket: Lex;
            while (this.hasCurrentLex() && !rightAngleBracket) {
                tagSegments.add(this.getCurrentLex());

                if (this.getCurrentLex().getType() === LexType.Dash) {
                    if (closingDashCount < 2) {
                        ++closingDashCount;
                    }
                }
                else {
                    if (this.getCurrentLex().getType() === LexType.RightAngleBracket && closingDashCount === 2) {
                        rightAngleBracket = this.getCurrentLex();
                    }

                    closingDashCount = 0;
                }

                this.nextLex();
            }

            if (!rightAngleBracket) {
                if (closingDashCount === 0) {
                    this.addIssue(Issues.missingCommentClosingDashes(new qub.Span(tagSegments.get(2).startIndex, 2)));
                }
                else if (closingDashCount === 1) {
                    this.addIssue(Issues.missingCommentSecondClosingDash(tagSegments.last().span));
                }

                this.addIssue(Issues.missingCommentRightAngleBracket(tagSegments.first().span));
            }

            result = new Comment(tagSegments);
        }

        return result;
    }

    /**
     * Read an XML CDATA tag from the subtokenizer. The Lexer must be pointing at the first start
     * left square bracket when this function is called.
     */
    private readCDATA(tagSegments: qub.ArrayList<Segment>): Tag {
        const firstLeftSquareBracket: Lex = this.getCurrentLex();
        tagSegments.add(firstLeftSquareBracket);
        this.nextLex();

        let result: Tag;
        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingCDATAName(firstLeftSquareBracket.span));
            result = this.readUnrecognizedTag(tagSegments);
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    const name: Name = this.readName();
                    tagSegments.add(name);
                    if (name.toString() !== "CDATA") {
                        this.addIssue(Issues.expectedCDATAName(name.span));
                        result = this.readUnrecognizedTag(tagSegments);
                    }
                    else if (!this.hasCurrentLex()) {
                        this.addIssue(Issues.missingCDATASecondLeftSquareBracket(firstLeftSquareBracket.span));
                        result = this.readUnrecognizedTag(tagSegments);
                    }
                    else if (this.getCurrentLex().getType() !== LexType.LeftSquareBracket) {
                        this.addIssue(Issues.expectedCDATASecondLeftSquareBracket(this.getCurrentLex().span));
                        result = this.readUnrecognizedTag(tagSegments);
                    }
                    else {
                        let closingRightSquareBracketCount: number = 0;
                        let rightAngleBracket: Lex;
                        while (this.hasCurrentLex() && !rightAngleBracket) {
                            tagSegments.add(this.getCurrentLex());

                            if (this.getCurrentLex().getType() === LexType.RightSquareBracket) {
                                if (closingRightSquareBracketCount < 2) {
                                    ++closingRightSquareBracketCount;
                                }
                            }
                            else {
                                if (this.getCurrentLex().getType() === LexType.RightAngleBracket && closingRightSquareBracketCount === 2) {
                                    rightAngleBracket = this.getCurrentLex();
                                }
                                closingRightSquareBracketCount = 0;
                            }

                            this.nextLex();
                        }

                        if (!rightAngleBracket) {
                            if (closingRightSquareBracketCount === 0) {
                                this.addIssue(Issues.missingCDATARightSquareBrackets(tagSegments.get(4).span));
                            }
                            else if (closingRightSquareBracketCount === 1) {
                                this.addIssue(Issues.missingCDATASecondRightSquareBracket(tagSegments.last().span));
                            }

                            this.addIssue(Issues.missingCDATARightAngleBracket(tagSegments.first().span));
                        }

                        result = new CDATA(tagSegments);
                    }
                    break;

                default:
                    this.addIssue(Issues.expectedCDATAName(this.getCurrentLex().span));
                    result = this.readUnrecognizedTag(tagSegments);
                    break;
            }
        }

        return result;
    }

    /**
     * Read the tag that this Tokenizer is currently pointing at. The tokenizer must be currently
     * pointing at a LeftAngleBracket basic token when this function is called.
     */
    private readTag(): Segment {
        const leftAngleBracket: Lex = this.getCurrentLex();
        const tagSegments = new qub.ArrayList<Segment>([leftAngleBracket]);
        this.nextLex();

        let result: Segment;

        if (!this.hasCurrentLex()) {
            this.addIssue(Issues.missingNameQuestionMarkExclamationPointOrForwardSlash(leftAngleBracket.span));
            result = this.readUnrecognizedTag(tagSegments);
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.Letters:
                case LexType.Underscore:
                case LexType.Colon:
                    result = this.readStartTagOrEmptyTag(tagSegments);
                    break;

                case LexType.QuestionMark:
                    const leftQuestionMark: Lex = this.getCurrentLex();
                    tagSegments.add(leftQuestionMark);
                    this.nextLex();

                    if (!this.hasCurrentLex()) {
                        this.addIssue(Issues.missingDeclarationOrProcessingInstructionName(leftQuestionMark.span));
                        result = this.readUnrecognizedTag(tagSegments);
                    }
                    else {
                        switch (this.getCurrentLex().getType()) {
                            case LexType.Letters:
                            case LexType.Underscore:
                            case LexType.Colon:
                                const name: Name = this.readName();
                                tagSegments.add(name);
                                if (name.toString().toLowerCase() === "xml") {
                                    result = this.readDeclaration(tagSegments);
                                }
                                else {
                                    result = this.readProcessingInstruction(tagSegments);
                                }
                                break;

                            default:
                                this.addIssue(Issues.expectedDeclarationOrProcessingInstructionName(this.getCurrentLex().span));
                                result = this.readUnrecognizedTag(tagSegments);
                                break;
                        }
                    }
                    break;

                case LexType.ForwardSlash:
                    const endTagForwardSlash: Lex = this.getCurrentLex();
                    tagSegments.add(endTagForwardSlash);
                    this.nextLex();

                    result = this.readEndTag(tagSegments);
                    break;

                case LexType.ExclamationPoint:
                    tagSegments.add(this.getCurrentLex());
                    this.nextLex();

                    if (!this.hasCurrentLex()) {
                        result = this.readUnrecognizedTag(tagSegments);
                    }
                    else {
                        switch (this.getCurrentLex().getType()) {
                            case LexType.Letters:
                            case LexType.Underscore:
                            case LexType.Colon:
                                const name: Name = this.readName();
                                tagSegments.add(name);
                                if (name.toString() === "DOCTYPE") {
                                    result = this.readDOCTYPE(tagSegments);
                                }
                                else {
                                    this.addIssue(Issues.expectedDOCTYPENameCommentDashesOrCDATALeftSquareBracket(name.span));
                                    result = this.readUnrecognizedTag(tagSegments);
                                }
                                break;

                            case LexType.Dash:
                                result = this.readComment(tagSegments);
                                break;

                            case LexType.LeftSquareBracket:
                                result = this.readCDATA(tagSegments);
                                break;

                            default:
                                result = this.readUnrecognizedTag(tagSegments);
                                break;
                        }
                    }
                    break;

                default:
                    this.addIssue(Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(this.getCurrentLex().span));
                    result = this.readUnrecognizedTag(tagSegments);
                    break;
            }
        }

        return result;
    }

    /**
     * Move to the next XML segment in this segment stream. The returned value is whether or not the
     * tokenizer is now pointing at a segment.
     */
    public next(): boolean {
        if (!this.hasStarted()) {
            this.nextLex();
        }

        if (!this.hasCurrentLex()) {
            this._currentSegment = undefined;
        }
        else {
            switch (this.getCurrentLex().getType()) {
                case LexType.LeftAngleBracket:
                    this._currentSegment = this.readTag();
                    break;

                case LexType.NewLine:
                    this._currentSegment = this.getCurrentLex();
                    this.nextLex();
                    break;

                default:
                    const textTokens = new qub.ArrayList<Lex>([this.getCurrentLex()]);
                    while (this.nextLex() && this.getCurrentLex().getType() !== LexType.LeftAngleBracket && this.getCurrentLex().getType() !== LexType.NewLine) {
                        textTokens.add(this.getCurrentLex());
                    }
                    this._currentSegment = new Text(textTokens);
                    break;
            }
        }

        return this.hasCurrent();
    }
}

/**
 * An XML Element that starts with a StartTag, may contain child elements or tags, and may end with
 * an EndTag.
 */
export class Element extends SegmentGroup {
    constructor(segments: qub.Indexable<Segment>) {
        super(segments);
    }

    public format(context?: FormatContext): string {
        context = initializeContext(context);

        let result: string = this.startTag.format(context);

        if (!this.children.any()) {
            if (this.endTag) {
                const endTagFormattedText: string = this.endTag.format(context);

                if (endTagFormattedText === `</${this.startTag.getName().toString()}>`) {
                    result = result.substr(0, result.length - 1) + "/>";
                    context.currentColumnIndex -= (endTagFormattedText.length - 1);
                }
                else {
                    result += endTagFormattedText;
                }
            }
        }
        else if (this.children.getCount() === 1 && this.children.get(0) instanceof Text) {
            const textChild: Text = this.children.get(0) as Text;

            const childFormattedText: string = textChild.format(context);
            result += childFormattedText;

            if (this.endTag) {
                const endTagFormattedText: string = this.endTag.format(context);

                if (!childFormattedText && endTagFormattedText === `</${this.startTag.getName().toString()}>`) {
                    result = result.substr(0, result.length - 1) + "/>";
                    context.currentColumnIndex -= (endTagFormattedText.length - 1);
                }
                else {
                    result += endTagFormattedText;
                }
            }
        }
        else {
            context.pushNewIndent();

            let previousChildWasNewLine: boolean = false;

            for (const child of this.children) {
                if (!(child instanceof Text) || !child.isWhitespace()) {
                    const currentChildIsNewLine: boolean = (child instanceof Lex && child.getType() === LexType.NewLine);

                    if (!currentChildIsNewLine) {
                        if (!previousChildWasNewLine) {
                            result += context.update(context.newLine);
                        }

                        result += context.update(context.currentIndent);
                    }

                    result += child.format(context);

                    previousChildWasNewLine = currentChildIsNewLine;
                }
            }

            context.popIndent();

            if (this.endTag) {
                if (!previousChildWasNewLine) {
                    result += context.update(context.newLine);
                }
                result += context.update(context.currentIndent) + this.endTag.format(context);
            }
        }

        return result;
    }

    /**
     * Get the StartTag for this Element.
     */
    public get startTag(): StartTag {
        return this.segments.first() as StartTag;
    }

    /**
     * Get the EndTag for this Element, if the EndTag exists.
     */
    public get endTag(): EndTag {
        const lastSegment: Segment = this.segments.last();
        return lastSegment instanceof EndTag ? lastSegment : undefined;
    }

    /**
     * Get the Name for this Element.
     */
    public getName(): Name {
        return this.startTag.getName();
    }

    public get attributes(): qub.Iterable<Attribute> {
        return this.startTag.attributes;
    }

    /**
     * Get the child Segments of this Element.
     */
    public get children(): qub.Indexable<Segment> {
        let result: qub.Indexable<Segment> = this.segments.skip(1);
        if (this.endTag) {
            result = result.take(this.segments.getCount() - 2);
        }
        return result;
    }

    public containsIndex(index: number): boolean {
        return this.startIndex < index && (!this.endTag || !this.endTag.getRightAngleBracket() || index <= this.endTag.getRightAngleBracket().startIndex);
    }
}

export class Prolog {
    constructor(private _segments: qub.Iterable<Segment>) {
    }

    public get declaration(): Declaration {
        return this._segments ? this._segments.first((segment: Segment) => segment instanceof Declaration) as Declaration : undefined;
    }

    public get doctype(): DOCTYPE {
        return this._segments ? this._segments.first((segment: Segment) => segment instanceof DOCTYPE) as DOCTYPE : undefined;
    }
}

/**
 * An XML Document that contains elements, tags, and text.
 */
export class Document {
    constructor(private _segments: qub.Iterable<Segment>, private _issues: qub.Iterable<qub.Issue>) {
    }

    public get segments(): qub.Iterable<Segment> {
        return this._segments;
    }

    public get issues(): qub.Iterable<qub.Issue> {
        return this._issues;
    }

    /**
     * Get the Prolog of this XML common. The Prolog contains the Document's Declaration tag,
     * DOCTYPE Declaration, and any Processing Instructions, whitespace, or comments that appear
     * before the Document's element.
     */
    public get prolog(): Prolog {
        const prologSegments = new qub.ArrayList<Segment>();

        if (this._segments) {
            for (const segment of this._segments) {
                if (segment instanceof Declaration ||
                    segment instanceof DOCTYPE ||
                    segment instanceof ProcessingInstruction ||
                    segment instanceof Comment ||
                    (segment instanceof Text && segment.isWhitespace()) ||
                    (segment instanceof Lex && segment.getType() === LexType.NewLine)) {

                    prologSegments.add(segment);
                }
                else {
                    break;
                }
            }
        }

        return !prologSegments.any() ? undefined : new Prolog(prologSegments);
    }

    /**
     * Get the Declaration of this Document, if it exists. If it doesn't exist, then undefined will
     * be returned.
     */
    public get declaration(): Declaration {
        return this._segments ? this._segments.first((segment: Segment) => segment instanceof Declaration) as Declaration : undefined;
    }

    public get doctype(): DOCTYPE {
        return this._segments ? this._segments.first((segment: Segment) => segment instanceof DOCTYPE) as DOCTYPE : undefined;
    }

    /**
     * Get the root element of this XML Document.
     */
    public get root(): Element | EmptyElement {
        return this._segments ? this._segments.first((segment: Segment) => segment instanceof Element || segment instanceof EmptyElement) as Element | EmptyElement : undefined;
    }

    /**
     * Get the string representation of this Document.
     */
    public toString(): string {
        return qub.getCombinedText(this._segments);
    }

    /**
     * Get the formatted string representation of this Document.
     */
    public format(contextOrData: FormatContext | FormatContextData): string {
        const context: FormatContext = initializeContext(contextOrData);

        let result: string = "";
        if (this._segments) {
            let previousChildWasNewLine: boolean = false;
            for (const segment of this._segments) {
                if (!(segment instanceof Text) || !segment.isWhitespace()) {
                    const currentSegmentIsNewLine: boolean = (segment instanceof Lex && segment.getType() === LexType.NewLine);

                    if (result && !currentSegmentIsNewLine && !previousChildWasNewLine) {
                        result += context.update(context.newLine);
                    }

                    result += segment.format(context);
                    previousChildWasNewLine = currentSegmentIsNewLine;
                }
            }
        }
        return result;
    }

    /**
     * Get the number of characters that are contained by this common.
     */
    public getLength(): number {
        return qub.getContiguousLength(this._segments);
    }
}

/**
 * Parse an XML Element from the provided tokenizer. When this function is called, the provided
 * Tokenizer must be pointing at a StartTag.
 */
export function parseElement(tokenizer: Tokenizer): Element {
    const startTag: StartTag = tokenizer.getCurrent() as StartTag;
    const elementSegments = new qub.ArrayList<Segment>([startTag]);
    tokenizer.next();

    let endTag: EndTag;
    while (tokenizer.hasCurrent() && !endTag) {
        const currentSegment: Segment = tokenizer.getCurrent();
        if (currentSegment instanceof StartTag) {
            elementSegments.add(parseElement(tokenizer));
        }
        else {
            if (currentSegment instanceof EndTag) {
                endTag = currentSegment;
            }
            elementSegments.add(currentSegment);
            tokenizer.next();
        }
    }

    if (!endTag) {
        tokenizer.addIssue(Issues.missingElementEndTag(startTag.getName().span, startTag.getName().toString()));
    }
    else if (endTag.name && endTag.name.toString() !== startTag.getName().toString()) {
        tokenizer.addIssue(Issues.expectedElementEndTagWithDifferentName(endTag.name.span, startTag.getName().toString()));
    }

    return new Element(elementSegments);
}

/**
 * Parse an XML Document from the provided text string.
 */
export function parse(text: string): Document {
    const issues = new qub.ArrayList<qub.Issue>();
    const tokenizer = new Tokenizer(text, 0, issues);
    tokenizer.next();

    const documentSegments = new qub.ArrayList<Segment>();
    let foundDeclaration: boolean;
    let foundDoctype: boolean;
    let foundRootElement: boolean;

    if (!tokenizer.hasCurrent()) {
        tokenizer.addIssue(Issues.missingDocumentRootElement());
    }
    else {
        while (tokenizer.hasCurrent()) {
            const currentSegment: Segment = tokenizer.getCurrent();
            if (currentSegment instanceof StartTag) {
                const element: Element = parseElement(tokenizer);
                if (!foundRootElement) {
                    foundRootElement = true;
                }
                else {
                    tokenizer.addIssue(Issues.documentCanHaveOneRootElement(element.span));
                }
                documentSegments.add(element);
            }
            else {
                if (currentSegment instanceof Declaration) {
                    if (!foundDeclaration) {
                        foundDeclaration = true;
                        if (documentSegments.any()) {
                            tokenizer.addIssue(Issues.documentDeclarationMustBeFirstSegment(currentSegment.span));
                        }
                    }
                    else {
                        tokenizer.addIssue(Issues.documentCanHaveOneDeclaration(currentSegment.span));
                    }
                }
                else if (currentSegment instanceof DOCTYPE) {
                    if (!foundDoctype) {
                        foundDoctype = true;
                        if (!foundDeclaration) {
                            tokenizer.addIssue(Issues.documentDOCTYPEMustBeAfterDeclaration(currentSegment.span));
                        }
                    }
                    else {
                        tokenizer.addIssue(Issues.documentCanHaveOneDOCTYPE(currentSegment.span));
                    }
                }
                else if (currentSegment instanceof EmptyElement) {
                    if (!foundRootElement) {
                        foundRootElement = true;
                    }
                    else {
                        tokenizer.addIssue(Issues.documentCanHaveOneRootElement(currentSegment.span));
                    }
                }
                else if (currentSegment instanceof Text) {
                    if (!currentSegment.isWhitespace()) {
                        tokenizer.addIssue(Issues.documentCannotHaveTextAtRootLevel(currentSegment.nonWhitespaceSpan));
                    }
                }
                else if (currentSegment instanceof CDATA) {
                    tokenizer.addIssue(Issues.documentCannotHaveCDATAAtRootLevel(currentSegment.span));
                }

                documentSegments.add(currentSegment);
                tokenizer.next();
            }
        }
    }

    return new Document(documentSegments, issues);
}

/**
 * A schema that can be applied to an attribute in an Element.
 */
export interface AttributeSchemaContents<ExtraPropertiesType = Object> {
    /**
     * The expected name of the attribute.
     */
    name: string;
    /**
     * Whether or not an attribute that matches this schema is required.
     */
    required?: boolean;
    /**
     * If defined, the parent element must define an attribute that matches this schema if no
     * attribute exists with this name.
     */
    requiredIfNotDefined?: string;
    /**
     * If defined, the parent element must not define an attribute that matches this schema if an
     * attribute exists with this name.
     */
    notWith?: string;
    /**
     * The optional extra properties that can be assigned to this schema.
     */
    extraProperties?: ExtraPropertiesType;
}

/**
 * A schema that can be applied to an attribute in an Element.
 */
export class AttributeSchema<ExtraPropertiesType = Object> {
    constructor(private _contents: AttributeSchemaContents<ExtraPropertiesType>) {
    }

    /**
     * The expected name of the attribute.
     */
    public get name(): string {
        return this._contents.name;
    }

    /**
     * Whether or not an attribute that matches this schema is required.
     */
    public get required(): boolean {
        return this._contents.required ? true : false;
    }

    /**
     * If defined, the parent element must define an attribute that matches this schema if no
     * attribute exists with this name.
     */
    public get requiredIfNotDefined(): string {
        return this._contents.requiredIfNotDefined;
    }

    /**
     * If defined, the parent element must not define an attribute that matches this schema if an
     * attribute exists with this name.
     */
    public get notWith(): string {
        return this._contents.notWith;
    }

    /**
     * The optional extra properties that can be assigned to this schema.
     */
    public get extraProperties(): ExtraPropertiesType {
        return this._contents.extraProperties;
    }
}

/**
 * A schema that can be applied to the child of an XML Element. This schema really functions more
 * like a pointer to an ElementSchema.
 * The ElementType is the language specific unique identifier for a matching element's type. We use
 * this instead of just using the name because some elements can have different schemas based on
 * where they exist in an XML document.
 */
export interface ChildElementSchemaContents<ElementType> {
    /**
     * The type of the child element that matches this schema.
     */
    type: ElementType,
    /**
     * Whether or not this schema is required by the parent ElementSchema.
     */
    required?: boolean;
    /**
     * Whether or not the parent ElementSchema can have only one element that matches this schema.
     */
    atMostOne?: boolean;
    /**
     * Whether or not an element that matches this schema must be the last child element of an
     * element that matches the parent ElementSchema.
     */
    mustBeLast?: boolean;
}

/**
 * A schema that can be applied to the child of an XML Element. This schema really functions more
 * like a pointer to an ElementSchema.
 * The ElementType is the language specific unique identifier for a matching element's type. We use
 * this instead of just using the name because some elements can have different schemas based on
 * where they exist in an XML document.
 */
export class ChildElementSchema<ElementType> {
    constructor(private _contents: ChildElementSchemaContents<ElementType>) {
    }

    /**
     * The type of the child element that matches this schema.
     */
    public get type(): ElementType {
        return this._contents.type;
    }

    /**
     * Whether or not this schema is required by the parent ElementSchema.
     */
    public get required(): boolean {
        return this._contents.required ? true : false;
    }

    /**
     * Whether or not the parent ElementSchema can have only one element that matches this schema.
     */
    public get atMostOne(): boolean {
        return this._contents.atMostOne ? true : false;
    }

    /**
     * Whether or not an element that matches this schema must be the last child element of an
     * element that matches the parent ElementSchema.
     */
    public get mustBeLast(): boolean {
        return this._contents.mustBeLast ? true : false;
    }
}

/**
 * A schema that can be applied to an XML Element or EmptyElement.
 * The ElementType is the language specific unique identifier for a matching element's type. We use
 * this instead of just using the name because some elements can have different schemas based on
 * where they exist in an XML document.
 */
export interface ElementSchemaContents<ElementType, ExtraPropertiesType = Object> {
    /**
     * The expected element name.
     */
    name: string;
    /**
     * The attributes that this schema expects to find on an element.
     */
    attributes?: AttributeSchema[];
    /**
     * Whether or not this schema allows all attributes.
     */
    allowAllAttributes?: boolean;
    /**
     * If defined, then all of an element's child elements that don't match any of the childElements
     * schemas must match this schema.
     */
    additionalChildElements?: ChildElementSchema<ElementType>;
    /**
     * If defined and not empty, then all of an element's child elements must match one of these
     * schemas or the additionalChildElements schema (if it is defined).
     */
    childElements?: ChildElementSchema<ElementType>[];
    /**
     * Whether or not an element's child elements will be validated for this schema.
     */
    dontValidateChildElements?: boolean;
    /**
     * Whether or not text child elements are allowed by this schema.
     */
    allowTextChildElements?: boolean;
    /**
     * The optional extra properties that can be assigned to this schema. These could be used for
     * editor specific data, such as a description of this schema.
     */
    extraProperties?: ExtraPropertiesType;
}

/**
 * A schema that can be applied to an XML Element or EmptyElement.
 * The ElementType is the language specific unique identifier for a matching element's type. We use
 * this instead of just using the name because some elements can have different schemas based on
 * where they exist in an XML document.
 */
export class ElementSchema<ElementType, ExtraPropertiesType = Object> {
    constructor(private _contents: ElementSchemaContents<ElementType, ExtraPropertiesType>) {
    }

    /**
     * The expected element name.
     */
    public get name(): string {
        return this._contents.name;
    }

    /**
     * Check whether the provided name matches against this schema's expected name.
     * @param name The name to compare against this schema's expected name.
     */
    public matchesName(name: Name): boolean {
        return matches(this.name, name);
    }

    /**
     * Get the attributes that this schema expects to find on an element.
     */
    public get attributes(): qub.Iterable<AttributeSchema> {
        return new qub.ArrayList<AttributeSchema>(this._contents.attributes);
    }

    /**
     * Get the names of the attributes that this schema will allow on an element.
     */
    public get attributeNames(): qub.Iterable<string> {
        return this.attributes.map((allowedAttribute: AttributeSchema) => allowedAttribute.name);
    }

    /**
     * Get the attributes that this schema requires exist on an element.
     */
    public get requiredAttributes(): qub.Iterable<AttributeSchema> {
        return this.attributes.where((allowedAttribute: AttributeSchema) => allowedAttribute.required || allowedAttribute.requiredIfNotDefined ? true : false);
    }

    /**
     * Get the AttributeSchema within this schema that expects the provided attributeName.
     * @param attributeName The name of the attribute to look for.
     */
    public getAttributeSchema(attributeName: string): AttributeSchema {
        return this.attributes.first((allowedAttribute: AttributeSchema) => matches(allowedAttribute.name, attributeName));
    }

    /**
     * Whether or not this schema allows all attributes.
     */
    public get allowAllAttributes(): boolean {
        return this._contents.allowAllAttributes ? true : false;
    }

    /**
     * If defined, then all of an element's child elements that don't match any of the childElements
     * schemas must match this schema.
     */
    public get additionalChildElements(): ChildElementSchema<ElementType> {
        return this._contents.additionalChildElements;
    }

    /**
     * If defined and not empty, then all of an element's child elements must match one of these
     * schemas or the additionalChildElements schema (if it is defined).
     */
    public get childElements(): qub.Iterable<ChildElementSchema<ElementType>> {
        return new qub.SingleLinkList<ChildElementSchema<ElementType>>(this._contents.childElements);
    }

    /**
     * The ChildElementSchemas of the child elements that an element must have to validate against
     * this schema.
     */
    public get requiredChildElements(): qub.Iterable<ChildElementSchema<ElementType>> {
        return this.childElements.where((allowedChildElement: ChildElementSchema<ElementType>) => allowedChildElement.required);
    }

    /**
     * If defined, then the last child element (if there are any) must validate against this
     * ChildElementSchema.
     */
    public get mustBeLastChildElement(): ChildElementSchema<ElementType> {
        return this.childElements.first((allowedChildElement: ChildElementSchema<ElementType>) => allowedChildElement.mustBeLast);
    }

    /**
     * If defined and not empty, then an element must have at least one element that validates
     * against each of these ChildElementSchemas.
     */
    public get atMostOneChildElements(): qub.Iterable<ChildElementSchema<ElementType>> {
        return this.childElements.where((allowedChildElement: ChildElementSchema<ElementType>) => allowedChildElement.atMostOne);
    }

    /**
     * Whether or not an element's child elements will be validated for this schema.
     */
    public get dontValidateChildElements(): boolean {
        return this._contents.dontValidateChildElements ? true : false;
    }

    /**
     * Whether or not text child elements are allowed by this schema.
     */
    public get allowTextChildElements(): boolean {
        return this._contents.allowTextChildElements ? true : false;
    }

    /**
     * The optional extra properties that can be assigned to this schema.
     */
    public get extraProperties(): ExtraPropertiesType {
        return this._contents.extraProperties;
    }
}