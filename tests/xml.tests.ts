import * as assert from "assert";

import * as qub from "qub";
import * as xml from "../sources/xml";

function parseQubLexes(text: string, startIndex: number = 0): qub.Iterable<qub.Lex> {
    return new qub.Lexer(text, startIndex).toArrayList();
}

function parseLetters(text: string, startIndex: number = 0): xml.Lex {
    return xml.Letters(text, startIndex);
}

function parseDigits(text: string, startIndex: number = 0): xml.Lex {
    return xml.Digits(text, startIndex);
}

function parseWhitespace(text: string, startIndex: number = 0): xml.Lex {
    return xml.Whitespace(text, startIndex);
}

function parseNewLine(text: string, startIndex: number = 0): xml.Lex {
    return xml.NewLine(text, startIndex);
}

function parseUnrecognized(text: string, startIndex: number = 0): xml.Lex {
    return xml.Unrecognized(text, startIndex);
}

function parseXmlLexes(text: string, startIndex: number = 0): qub.Indexable<xml.Lex> {
    return new xml.Lexer(text, startIndex).toArrayList();
}

/**
 * Parse an XML Name Segment from the provided text at the provided start index.
 */
function parseName(text: string, startIndex: number = 0): xml.Name {
    return new xml.Name(parseXmlLexes(text, startIndex));
}

function parseAttribute(text: string, startIndex: number = 0): xml.Attribute {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    const tagSegments = new qub.ArrayList<xml.Segment>();
    return tokenizer.readAttribute(tagSegments);
}

/**
 * Parse an XML Text token from the provided text string at the provided start index.
 */
function parseText(text: string, startIndex: number = 0): xml.Text {
    return new xml.Text(parseXmlLexes(text, startIndex));
}

/**
 * Parse an XML QuotedString Segment from the provided text at the provided start index.
 */
function parseQuotedString(text: string, startIndex: number = 0): xml.QuotedString {
    return new xml.QuotedString(parseXmlLexes(text, startIndex));
}

/**
 * Parse an XML Declaration from the provided text string at the provided start index.
 */
function parseDeclaration(text: string, startIndex: number = 0): xml.Declaration {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.Declaration, "When parsing an XML Declaration, the first segment must be a Declaration.");
    return tokenizer.getCurrent() as xml.Declaration;
}

/**
 * Parse an XML DOCTYPE from the provided text string at the provided start index.
 */
function parseDOCTYPE(text: string, startIndex: number = 0): xml.DOCTYPE {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.DOCTYPE);
    return tokenizer.getCurrent() as xml.DOCTYPE;
}

/**
 * Parse an XML internal document type definition from the provided text string at the provided
 * start index.
 */
function parseInternalDefinition(text: string, startIndex: number = 0): xml.InternalDefinition {
    return new xml.InternalDefinition(parseXmlLexes(text, startIndex));
}

/**
 * Parse an XML ProcessingInstruction from the provided text string at the provided start index.
 */
function parseProcessingInstruction(text: string, startIndex: number = 0): xml.DOCTYPE {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.ProcessingInstruction);
    return tokenizer.getCurrent() as xml.ProcessingInstruction;
}

/**
 * Parse a StartTag from the provided text at the provided start index.
 */
function parseStartTag(text: string, startIndex: number = 0): xml.StartTag {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.StartTag);
    return tokenizer.getCurrent() as xml.StartTag;
}

/**
 * Parse an EndTag from the provided text at the provided start index.
 */
function parseEndTag(text: string, startIndex: number = 0): xml.EndTag {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.EndTag, `"${text}" does not parse to an EndTag.`);
    return tokenizer.getCurrent() as xml.EndTag;
}

/**
 * Parse an UnrecognizedTag from the provided text at the provided start index.
 */
function parseUnrecognizedTag(text: string, startIndex: number = 0): xml.UnrecognizedTag {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.UnrecognizedTag);
    return tokenizer.getCurrent() as xml.UnrecognizedTag;
}

/**
 * Parse a CDATA from the provided text at the provided start index.
 */
function parseCDATA(text: string, startIndex: number = 0): xml.CDATA {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.CDATA);
    return tokenizer.getCurrent() as xml.CDATA;
}

/**
 * Parse a Comment from the provided text at the provided start index.
 */
function parseComment(text: string, startIndex: number = 0): xml.Comment {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.Comment);
    return tokenizer.getCurrent() as xml.Comment;
}

/**
 * Parse each XML Segment from the provided text at the provided start index.
 */
function parseSegments(text: string, startIndex: number = 0): qub.Iterable<xml.Segment> {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    const segments: xml.Segment[] = [];
    while (tokenizer.next()) {
        segments.push(tokenizer.getCurrent());
    }
    return new qub.ArrayList(segments);
}

/**
 * Parse an XML Prolog from the provided text. The prolog's start index must always be 0, so no
 * start index can be provided.
 */
function parseProlog(text: string): xml.Prolog {
    return new xml.Prolog(parseSegments(text));
}

/**
 * Parse an Element from the provided text at the provided start index.
 */
function parseElement(text: string, startIndex: number = 0): xml.Element {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.StartTag, "The first segment of an Element's text must be a start tag.");
    return xml.parseElement(tokenizer);
}

/**
 * Parse an EmptyElement from the provided text at the provided start index.
 */
function parseEmptyElement(text: string, startIndex: number = 0): xml.EmptyElement {
    const tokenizer = new xml.Tokenizer(text, startIndex);
    assert.deepEqual(tokenizer.next(), true);
    assert(tokenizer.getCurrent() instanceof xml.EmptyElement, "The first segment of an EmptyElement's text must be an EmptyElement.");
    return tokenizer.getCurrent() as xml.EmptyElement;
}

suite("XML", () => {
    function basicSegmentTests(segment: xml.Segment, startIndex: number, text: string): void {
        assert.deepEqual(segment.toString(), text, "Wrong toString().");
        assert.deepEqual(segment.getLength(), text.length, "Wrong length.");
        assert.deepEqual(segment.startIndex, startIndex, "Wrong start index.");
        assert.deepEqual(segment.afterEndIndex, startIndex + text.length, "Wrong after end index.");
        assert.deepEqual(segment.span, new qub.Span(startIndex, text.length));
    }

    function testContainsIndex(segment: xml.Segment, expected: (index: number) => boolean): void {
        for (let i = segment.startIndex - 1; i <= segment.afterEndIndex + 1; ++i) {
            const expectedContains: boolean = expected(i);
            assert.deepEqual(segment.containsIndex(i), expectedContains, `Index ${i} should${expectedContains ? "" : "n't"} have been contained by ${qub.escapeAndQuote(segment.toString())}.`);
        }
    }

    suite("FormatContext", () => {
        suite("constructor()", () => {
            test("with no arguments", () => {
                const context = new xml.FormatContext();
                assert.deepEqual(context.data, {
                    singleIndent: "  ",
                    tabLength: 2,
                    currentIndent: "",
                    newline: "\n",
                    currentColumnIndex: 0,
                    alignAttributes: false
                })
            });

            function constructorTest(data: xml.FormatContextData, expectedData: xml.FormatContextData): void {
                test(`with ${JSON.stringify(data)}`, () => {
                    const context = new xml.FormatContext(data);
                    assert.deepEqual(context.data, expectedData);
                });
            }

            constructorTest(undefined, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest(null, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest({}, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest({ alignAttributes: undefined }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ alignAttributes: null }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ alignAttributes: false }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ alignAttributes: true }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: true
            });

            constructorTest({ currentIndent: undefined }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentIndent: null }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentIndent: "" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentIndent: "     " }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "     ",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentIndent: "abc" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "abc",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest({ newline: undefined }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ newline: null }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ newline: "" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ newline: "\n" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ newline: "\r\n" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\r\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ newline: "ab" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "ab",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest({ singleIndent: undefined }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ singleIndent: null }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ singleIndent: "" }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ singleIndent: " " }, {
                singleIndent: " ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ singleIndent: "  " }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ singleIndent: "123" }, {
                singleIndent: "123",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });

            constructorTest({ currentColumnIndex: undefined }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentColumnIndex: null }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentColumnIndex: -10 }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: -10,
                alignAttributes: false
            });
            constructorTest({ currentColumnIndex: 0 }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 0,
                alignAttributes: false
            });
            constructorTest({ currentColumnIndex: 20 }, {
                singleIndent: "  ",
                tabLength: 2,
                currentIndent: "",
                newline: "\n",
                currentColumnIndex: 20,
                alignAttributes: false
            });
        });

        suite("update()", () => {
            function updateTest(value: string, expectedCurrentColumnIndex: number): void {
                test(`with ${qub.escapeAndQuote(value)}`, () => {
                    const context = new xml.FormatContext();
                    const result: string = context.update(value);
                    assert.deepEqual(result, value);
                    assert.deepEqual(context.currentColumnIndex, expectedCurrentColumnIndex);
                });
            }

            updateTest(undefined, 0);
            updateTest(null, 0);
            updateTest("", 0);
            updateTest("a", 1);
            updateTest("abcdefg", 7);
            updateTest("a\nb\nc", 1);
        });
    });

    suite("initializeContext()", () => {
        test("with undefined", () => {
            const context: xml.FormatContext = xml.initializeContext(undefined);
            assert.deepEqual(context, new xml.FormatContext());
        });

        test("with null", () => {
            const context: xml.FormatContext = xml.initializeContext(null);
            assert.deepEqual(context, new xml.FormatContext());
        });

        test("with FormatOptions", () => {
            const context: xml.FormatContext = xml.initializeContext({ alignAttributes: true });
            assert.deepEqual(context, new xml.FormatContext({
                alignAttributes: true
            }));
        });
    });

    suite("Lex", () => {
        test("constructor()", () => {
            const lex = new xml.Lex("<", 5, xml.LexType.LeftAngleBracket);
            assert.deepEqual(lex.toString(), "<");
            assert.deepEqual(lex.startIndex, 5);
            assert.deepEqual(lex.getType(), xml.LexType.LeftAngleBracket);

            const formatContext = new xml.FormatContext();
            assert.deepEqual(lex.format(formatContext), "<");
            assert.deepEqual(formatContext.currentColumnIndex, 1);
        });
    });

    suite("Lexer", () => {
        suite("next()", () => {
            function nextTest(text: string, expectedLexes: xml.Lex | xml.Lex[] = []): void {
                if (expectedLexes instanceof xml.Lex) {
                    expectedLexes = [expectedLexes];
                }

                test(`with ${qub.escapeAndQuote(text)}`, () => {
                    const lexer = new xml.Lexer(text);

                    for (const expectedLex of expectedLexes as xml.Lex[]) {
                        assert.deepEqual(lexer.next(), true, "Expected more lexes, next() was false.");
                        assert.deepEqual(lexer.hasStarted(), true, "Expected more lexes, hasStarted() was false.");
                        assert.deepEqual(lexer.getCurrent(), expectedLex);
                    }

                    for (let i: number = 0; i < 2; ++i) {
                        assert.deepEqual(lexer.next(), false, "Expected no more lexes, next() was true.");
                        assert.deepEqual(lexer.hasStarted(), true, "Expected no more lexes, hasStarted() was false.");
                        assert.deepEqual(lexer.getCurrent(), undefined);
                    }
                });
            }

            nextTest(null);
            nextTest(undefined);
            nextTest("");
            nextTest(" ", parseWhitespace(" "));
            nextTest("\t", parseWhitespace("\t"));
            nextTest("\r", parseWhitespace("\r"));
            nextTest("\n", parseNewLine("\n"));
            nextTest("\r\n", parseNewLine("\r\n"));
        });
    });

    suite("Token", () => {
        test("constructor", () => {
            const token = new xml.Lex("<", 15, xml.LexType.LeftAngleBracket);
            assert.deepEqual(token.toString(), "<");
            assert.deepEqual(token.getLength(), 1, "Wrong length.");
            assert.deepEqual(token.startIndex, 15, "Wrong start index.");
            assert.deepEqual(token.afterEndIndex, 16, "Wrong after end index.");
            assert.deepEqual(token.getType(), xml.LexType.LeftAngleBracket);

            const context = new xml.FormatContext();
            assert.deepEqual(token.format(context), "<");
            assert.deepEqual(context.currentColumnIndex, token.getLength());

            for (let i = token.startIndex - 1; i <= token.afterEndIndex + 1; ++i) {
                const expectedContains: boolean = token.startIndex <= i && i <= token.afterEndIndex;
                assert.deepEqual(token.containsIndex(i), expectedContains, `Index ${i} should${expectedContains ? "" : "n't"} have been contained by ${qub.escapeAndQuote(token.toString())}.`);
            }
        });
    });

    test("LeftAngleBracket()", () => {
        assert.deepEqual(xml.LeftAngleBracket(0), new xml.Lex("<", 0, xml.LexType.LeftAngleBracket));
    });

    test("RightAngleBracket()", () => {
        assert.deepEqual(xml.RightAngleBracket(1), new xml.Lex(">", 1, xml.LexType.RightAngleBracket));
    });

    test("LeftSquareBracket()", () => {
        assert.deepEqual(xml.LeftSquareBracket(2), new xml.Lex("[", 2, xml.LexType.LeftSquareBracket));
    });

    test("RightSquareBracket()", () => {
        assert.deepEqual(xml.RightSquareBracket(3), new xml.Lex("]", 3, xml.LexType.RightSquareBracket));
    });

    test("ExclamationPoint()", () => {
        assert.deepEqual(xml.ExclamationPoint(4), new xml.Lex("!", 4, xml.LexType.ExclamationPoint));
    });

    test("QuestionMark()", () => {
        assert.deepEqual(xml.QuestionMark(5), new xml.Lex("?", 5, xml.LexType.QuestionMark));
    });

    test("Dash()", () => {
        assert.deepEqual(xml.Dash(6), new xml.Lex("-", 6, xml.LexType.Dash));
    });

    test("SingleQuote()", () => {
        assert.deepEqual(xml.SingleQuote(7), new xml.Lex(`'`, 7, xml.LexType.SingleQuote));
    });

    test("DoubleQuote()", () => {
        assert.deepEqual(xml.DoubleQuote(8), new xml.Lex(`"`, 8, xml.LexType.DoubleQuote));
    });

    test("Equals()", () => {
        assert.deepEqual(xml.Equals(9), new xml.Lex("=", 9, xml.LexType.Equals));
    });

    test("Underscore()", () => {
        assert.deepEqual(xml.Underscore(10), new xml.Lex("_", 10, xml.LexType.Underscore));
    });

    test("Colon()", () => {
        assert.deepEqual(xml.Colon(11), new xml.Lex(":", 11, xml.LexType.Colon));
    });

    test("Semicolon()", () => {
        assert.deepEqual(xml.Semicolon(12), new xml.Lex(";", 12, xml.LexType.Semicolon));
    });

    test("Ampersand()", () => {
        assert.deepEqual(xml.Ampersand(13), new xml.Lex("&", 13, xml.LexType.Ampersand));
    });

    test("ForwardSlash()", () => {
        assert.deepEqual(xml.ForwardSlash(14), new xml.Lex("/", 14, xml.LexType.ForwardSlash));
    });

    test("Whitespace()", () => {
        assert.deepEqual(xml.Whitespace("  ", 15), new xml.Lex("  ", 15, xml.LexType.Whitespace));
    });

    test("NewLine()", () => {
        assert.deepEqual(xml.NewLine("\r\n", 19), new xml.Lex("\r\n", 19, xml.LexType.NewLine));
    });

    test("Letters()", () => {
        assert.deepEqual(xml.Letters("hello", 20), new xml.Lex("hello", 20, xml.LexType.Letters));
    });

    test("Digits()", () => {
        assert.deepEqual(xml.Digits("12345", 21), new xml.Lex("12345", 21, xml.LexType.Digits));
    });

    test("Unrecognized()", () => {
        assert.deepEqual(xml.Unrecognized("(", 22), new xml.Lex("(", 22, xml.LexType.Unrecognized));
    });

    suite("Name", () => {
        function nameTest(nameText: string): void {
            const expectedLength: number = nameText.length;
            const startIndex: number = 0;

            test(`with ${qub.escapeAndQuote(nameText)}`, () => {
                const name = new xml.Name(parseXmlLexes(nameText));
                assert.deepEqual(name.startIndex, startIndex);
                assert.deepEqual(name.getLength(), expectedLength);
                assert.deepEqual(name.afterEndIndex, startIndex + expectedLength);

                assert.deepEqual(name.span, new qub.Span(startIndex, expectedLength));

                assert.deepEqual(name.toString(), nameText);

                const context = new xml.FormatContext();
                assert.deepEqual(name.format(context), nameText);
                assert.deepEqual(context.currentColumnIndex, name.getLength());

                for (let i = name.startIndex - 1; i <= name.afterEndIndex + 1; ++i) {
                    assert.deepEqual(name.containsIndex(i), name.startIndex <= i && i <= name.afterEndIndex);
                }

                assert.deepStrictEqual(name.matches(undefined), false);
                assert.deepStrictEqual(name.matches("a1"), xml.matches(name, "a1"));
            });
        }

        nameTest("myName");
        nameTest("a1");
    });

    suite("QuotedString", () => {
        test(`with null`, () => {
            assert.throws(() => { new xml.QuotedString(null); });
        });

        test(`with undefined`, () => {
            assert.throws(() => { new xml.QuotedString(undefined); });
        });

        test(`with empty lexes iterable`, () => {
            assert.throws(() => { new xml.QuotedString(new qub.ArrayList<xml.Lex>()); });
        });

        function quotedStringTest(quotedStringLexes: qub.Iterable<xml.Lex>): void {
            const expectedString: string = qub.getCombinedText(quotedStringLexes);
            const expectedLength: number = qub.getCombinedLength(quotedStringLexes);
            const startIndex: number = 0;

            test(`with ${qub.escapeAndQuote(expectedString)}`, () => {
                const quotedString = new xml.QuotedString(quotedStringLexes);
                assert.deepEqual(quotedString.startIndex, startIndex);
                assert.deepEqual(quotedString.getLength(), expectedLength);
                assert.deepEqual(quotedString.afterEndIndex, startIndex + expectedLength);
                assert.deepEqual(quotedString.span, new qub.Span(startIndex, expectedLength));

                assert.deepEqual(quotedString.startQuote, quotedStringLexes && quotedStringLexes.any() ? quotedStringLexes.first() : undefined, "Wrong startQuote.");
                assert.deepEqual(quotedString.hasEndQuote(), quotedStringLexes && quotedStringLexes.getCount() > 1 && quotedStringLexes.first().getType() === quotedStringLexes.last().getType(), "Wrong hasEndQuote().");

                assert.deepEqual(quotedString.toString(), expectedString);
                const context = new xml.FormatContext();
                assert.deepEqual(quotedString.format(context), expectedString);
                assert.deepEqual(context.currentColumnIndex, quotedString.getLength());

                for (let i = startIndex - 1; i <= quotedString.afterEndIndex + 1; ++i) {
                    assert.deepEqual(quotedString.containsIndex(i), startIndex < i && (!quotedString.hasEndQuote() || i < quotedString.afterEndIndex), `Wrong containsIndex() at index ${i}.`);
                }

                let unquotedStringLexes: qub.Iterable<xml.Lex> = quotedStringLexes.skip(1);
                if (quotedString.hasEndQuote()) {
                    unquotedStringLexes = unquotedStringLexes.skipLast(1);
                }
                assert.deepEqual(quotedString.unquotedLexes.toArray(), unquotedStringLexes.toArray());
                assert.deepEqual(quotedString.unquotedString, qub.getCombinedText(unquotedStringLexes));
            });
        }

        quotedStringTest(parseXmlLexes(`"`));
        quotedStringTest(parseXmlLexes(`""`));
        quotedStringTest(parseXmlLexes(`"abc"`));
        quotedStringTest(parseXmlLexes(`'`));
        quotedStringTest(parseXmlLexes(`''`));
        quotedStringTest(parseXmlLexes(`'abc'`));
    });

    suite("matches()", () => {
        test("with undefined and undefined", () => {
            assert.deepStrictEqual(xml.matches(undefined, undefined), false);
        });

        test("with undefined and null", () => {
            assert.deepStrictEqual(xml.matches(undefined, null), false);
        });

        test(`with undefined and ""`, () => {
            assert.deepStrictEqual(xml.matches(undefined, ""), false);
        });

        test(`with undefined and "abc"`, () => {
            assert.deepStrictEqual(xml.matches(undefined, "abc"), false);
        });

        test(`with undefined and Name "abc"`, () => {
            assert.deepStrictEqual(xml.matches(undefined, parseName("abc")), false);
        });

        test("with null and undefined", () => {
            assert.deepStrictEqual(xml.matches(null, undefined), false);
        });

        test("with null and null", () => {
            assert.deepStrictEqual(xml.matches(null, null), false);
        });

        test(`with null and ""`, () => {
            assert.deepStrictEqual(xml.matches(null, ""), false);
        });

        test(`with null and "abc"`, () => {
            assert.deepStrictEqual(xml.matches(null, "abc"), false);
        });

        test(`with null and Name "abc"`, () => {
            assert.deepStrictEqual(xml.matches(null, parseName("abc")), false);
        });

        test(`with "" and undefined`, () => {
            assert.deepStrictEqual(xml.matches("", undefined), false);
        });

        test(`with "" and null`, () => {
            assert.deepStrictEqual(xml.matches("", null), false);
        });

        test(`with "" and ""`, () => {
            assert.deepStrictEqual(xml.matches("", ""), false);
        });

        test(`with "" and "abc"`, () => {
            assert.deepStrictEqual(xml.matches("", "abc"), false);
        });

        test(`with "" and Name "abc"`, () => {
            assert.deepStrictEqual(xml.matches("", parseName("abc")), false);
        });

        test(`with "abc" and undefined`, () => {
            assert.deepStrictEqual(xml.matches("abc", undefined), false);
        });

        test(`with "abc" and null`, () => {
            assert.deepStrictEqual(xml.matches("abc", null), false);
        });

        test(`with "abc" and ""`, () => {
            assert.deepStrictEqual(xml.matches("abc", ""), false);
        });

        test(`with "abc" and "abc"`, () => {
            assert.deepStrictEqual(xml.matches("abc", "abc"), true);
        });

        test(`with "abc" and Name "abc"`, () => {
            assert.deepStrictEqual(xml.matches("abc", parseName("abc")), true);
        });

        test(`with Name "abc" and undefined`, () => {
            assert.deepStrictEqual(xml.matches(parseName("abc"), undefined), false);
        });

        test(`with Name "abc" and null`, () => {
            assert.deepStrictEqual(xml.matches(parseName("abc"), null), false);
        });

        test(`with Name "abc" and ""`, () => {
            assert.deepStrictEqual(xml.matches(parseName("abc"), ""), false);
        });

        test(`with Name "abc" and "abc"`, () => {
            assert.deepStrictEqual(xml.matches(parseName("abc"), "abc"), true);
        });

        test(`with Name "abc" and Name "abc"`, () => {
            assert.deepStrictEqual(xml.matches(parseName("abc"), parseName("abc")), true);
        });
    });

    suite("Attribute", () => {
        test("with null segments", () => {
            assert.throws(() => { new xml.Attribute(null); });
        });

        test("with undefined segments", () => {
            assert.throws(() => { new xml.Attribute(undefined); });
        });

        test("with empty segments", () => {
            assert.throws(() => { new xml.Attribute(new qub.ArrayList<xml.Segment>()); });
        });

        test("with name", () => {
            const attribute = new xml.Attribute(new qub.ArrayList([parseName("hello", 99)]));
            basicSegmentTests(attribute, 99, "hello");

            const context = new xml.FormatContext();
            assert.deepEqual(attribute.format(context), "hello");
            assert.deepEqual(context.currentColumnIndex, attribute.getLength());

            testContainsIndex(attribute, (index: number) => { return attribute.startIndex <= index && index <= attribute.afterEndIndex; });

            assert.deepEqual(attribute.name, parseName("hello", 99), "Wrong name.");
            assert.deepEqual(attribute.equals, undefined, "Wrong equals sign.");
            assert.deepEqual(attribute.value, undefined, "Wrong value.");
        });

        test("with name and whitespace", () => {
            const attribute = new xml.Attribute(new qub.ArrayList([parseName("hello", 99), parseWhitespace("  ", 104)]));
            basicSegmentTests(attribute, 99, "hello  ");
            const context = new xml.FormatContext();
            assert.deepEqual(attribute.format(context), "hello");
            assert.deepEqual(context.currentColumnIndex, 5);

            testContainsIndex(attribute, (index: number) => { return attribute.startIndex <= index && index <= attribute.name.afterEndIndex; });

            assert.deepEqual(attribute.name, parseName("hello", 99));
            assert.deepEqual(attribute.equals, undefined);
            assert.deepEqual(attribute.value, undefined);
        });

        test("with name, equals, and value", () => {
            const attribute = new xml.Attribute(new qub.ArrayList([
                parseName("Project", 15),
                xml.Equals(22),
                parseWhitespace("\t", 23),
                parseQuotedString(`"test`, 24)
            ]));
            basicSegmentTests(attribute, 15, `Project=\t"test`);
            const context = new xml.FormatContext();
            assert.deepEqual(attribute.format(context), `Project="test`);
            assert.deepEqual(context.currentColumnIndex, 13);

            testContainsIndex(attribute, (index: number) => { return attribute.startIndex <= index; });

            assert.deepEqual(attribute.name, parseName("Project", 15));
            assert.deepEqual(attribute.equals, xml.Equals(22));
            assert.deepEqual(attribute.value, parseQuotedString(`"test`, 24));
        });

        test("with equals and value", () => {
            const attribute = new xml.Attribute(new qub.ArrayList([
                xml.Equals(22),
                parseQuotedString(`"pear "`, 23)
            ]));
            basicSegmentTests(attribute, 22, `="pear "`);
            const context = new xml.FormatContext();
            assert.deepEqual(attribute.format(context), `="pear "`);
            assert.deepEqual(context.currentColumnIndex, attribute.getLength());

            testContainsIndex(attribute, (index: number) => { return attribute.startIndex <= index && index < attribute.afterEndIndex; });

            assert.deepEqual(attribute.name, undefined);
            assert.deepEqual(attribute.equals, xml.Equals(22));
            assert.deepEqual(attribute.value, parseQuotedString(`"pear "`, 23));
        });
    });

    suite("Declaration", () => {
        test(`with "<?"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(5), xml.QuestionMark(6)]));
            basicSegmentTests(declaration, 5, "<?");
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), "<?");
            assert.deepEqual(context.currentColumnIndex, declaration.getLength());

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(5), "Wrong leftAngleBracket.");
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(6), "Wrong leftQuestionMark.");
            assert.deepEqual(declaration.getName(), undefined, "Wrong name.");
            assert.deepEqual(declaration.attributes.toArray(), [], "Wrong attributes.");
            assert.deepEqual(declaration.rightQuestionMark, undefined, "Wrong rightQuestionMark.");
            assert.deepEqual(declaration.getRightAngleBracket(), undefined, "Wrong rightAngleBracket.");

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?3"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(5), xml.QuestionMark(6), parseUnrecognized("3", 7)]));
            basicSegmentTests(declaration, 5, "<?3");
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), "<?3");
            assert.deepEqual(context.currentColumnIndex, declaration.getLength());

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(5));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(6));
            assert.deepEqual(declaration.getName(), undefined);
            assert.deepEqual(declaration.attributes.toArray(), []);
            assert.deepEqual(declaration.rightQuestionMark, undefined);
            assert.deepEqual(declaration.getRightAngleBracket(), undefined);

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(5), xml.QuestionMark(6), parseName("xml", 7), xml.QuestionMark(10), xml.RightAngleBracket(11)]));
            basicSegmentTests(declaration, 5, "<?xml?>");
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), "<?xml?>");
            assert.deepEqual(context.currentColumnIndex, declaration.getLength());

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(5));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(6));
            assert.deepEqual(declaration.getName(), parseName("xml", 7));
            assert.deepEqual(declaration.attributes.toArray(), []);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(10));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(11));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml  ?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(5),
                xml.QuestionMark(6),
                parseName("xml", 7),
                parseWhitespace("  ", 10),
                xml.QuestionMark(12),
                xml.RightAngleBracket(13)]));
            basicSegmentTests(declaration, 5, "<?xml  ?>");
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), "<?xml ?>");
            assert.deepEqual(context.currentColumnIndex, 8);

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(5));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(6));
            assert.deepEqual(declaration.getName(), parseName("xml", 7));
            assert.deepEqual(declaration.attributes.toArray(), []);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(12));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(13));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml version="1.0" ?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(5),
                xml.QuestionMark(6),
                parseName("xml", 7),
                parseWhitespace(" ", 10),
                parseAttribute(`version="1.0"`, 11),
                parseWhitespace(" ", 24),
                xml.QuestionMark(25),
                xml.RightAngleBracket(26)]));
            basicSegmentTests(declaration, 5, `<?xml version="1.0" ?>`);
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), `<?xml version="1.0" ?>`);
            assert.deepEqual(context.currentColumnIndex, declaration.getLength());

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(5));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(6));
            assert.deepEqual(declaration.getName(), parseName("xml", 7));
            assert.deepEqual(declaration.attributes.toArray(), [parseAttribute(`version="1.0"`, 11)]);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(25));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(26));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, parseAttribute(`version="1.0"`, 11));
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml  = 'b' ?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace("  ", 5),
                xml.Equals(7),
                parseWhitespace(" ", 8),
                parseQuotedString(`'b'`, 9),
                parseWhitespace(" ", 12),
                xml.QuestionMark(13),
                xml.RightAngleBracket(14)
            ]));
            basicSegmentTests(declaration, 0, `<?xml  = 'b' ?>`);
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), `<?xml = 'b' ?>`);
            assert.deepEqual(context.currentColumnIndex, 14);

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(1));
            assert.deepEqual(declaration.getName(), parseName("xml", 2));
            assert.deepEqual(declaration.attributes.toArray(), []);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(13));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(14));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml  a = 'b'  ?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace("  ", 5),
                parseAttribute(`a = 'b'`, 7),
                parseWhitespace("  ", 14),
                xml.QuestionMark(16),
                xml.RightAngleBracket(17)
            ]));
            basicSegmentTests(declaration, 0, `<?xml  a = 'b'  ?>`);
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), `<?xml a='b' ?>`);
            assert.deepEqual(context.currentColumnIndex, 14);

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(1));
            assert.deepEqual(declaration.getName(), parseName("xml", 2));
            assert.deepEqual(declaration.attributes.toArray(), [parseAttribute(`a = 'b'`, 7)]);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(16));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(17));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, undefined);
            assert.deepEqual(declaration.encoding, undefined);
            assert.deepEqual(declaration.standalone, undefined);
        });

        test(`with "<?xml version="1.0" encoding="utf-8" standalone="yes" ?>"`, () => {
            const declaration = new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace(" ", 5),
                parseAttribute(`version="1.0"`, 6),
                parseWhitespace(" ", 19),
                parseAttribute(`encoding="utf-8"`, 20),
                parseWhitespace(" ", 36),
                parseAttribute(`standalone="yes"`, 37),
                parseWhitespace(" ", 53),
                xml.QuestionMark(54),
                xml.RightAngleBracket(55)
            ]));
            basicSegmentTests(declaration, 0, `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>`);
            const context = new xml.FormatContext();
            assert.deepEqual(declaration.format(context), `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>`);
            assert.deepEqual(context.currentColumnIndex, 56);

            assert.deepEqual(declaration.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(declaration.leftQuestionMark, xml.QuestionMark(1));
            assert.deepEqual(declaration.getName(), parseName("xml", 2));
            assert.deepEqual(declaration.attributes.toArray(), [
                parseAttribute(`version="1.0"`, 6),
                parseAttribute(`encoding="utf-8"`, 20),
                parseAttribute(`standalone="yes"`, 37)
            ]);
            assert.deepEqual(declaration.rightQuestionMark, xml.QuestionMark(54));
            assert.deepEqual(declaration.getRightAngleBracket(), xml.RightAngleBracket(55));

            testContainsIndex(declaration, (index: number) => { return declaration.startIndex < index && index < declaration.afterEndIndex; });

            assert.deepEqual(declaration.version, parseAttribute(`version="1.0"`, 6));
            assert.deepEqual(declaration.encoding, parseAttribute(`encoding="utf-8"`, 20));
            assert.deepEqual(declaration.standalone, parseAttribute(`standalone="yes"`, 37));
        });
    });

    suite("StartTag", () => {
        test(`with "<a"`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1)]));
            basicSegmentTests(startTag, 0, "<a");
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), "<a");
            assert.deepEqual(context.currentColumnIndex, startTag.getLength());

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), []);
            assert.deepEqual(startTag.getRightAngleBracket(), undefined);

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index; });
        });

        test(`with "<a>"`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.RightAngleBracket(2)]));
            basicSegmentTests(startTag, 0, "<a>");
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), "<a>");
            assert.deepEqual(context.currentColumnIndex, startTag.getLength());

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), []);
            assert.deepEqual(startTag.getRightAngleBracket(), xml.RightAngleBracket(2));

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index && index < startTag.afterEndIndex; });
        });

        test(`with "<a  >"`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace("  ", 2), xml.RightAngleBracket(4)]));
            basicSegmentTests(startTag, 0, "<a  >");
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), "<a>");
            assert.deepEqual(context.currentColumnIndex, 3);

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), []);
            assert.deepEqual(startTag.getRightAngleBracket(), xml.RightAngleBracket(4));

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index && index < startTag.afterEndIndex; });
        });

        test(`with "<a b="c">"`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                parseWhitespace(" ", 2),
                parseAttribute(`b="c"`, 3),
                xml.RightAngleBracket(8)]));
            basicSegmentTests(startTag, 0, `<a b="c">`);
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), `<a b="c">`);
            assert.deepEqual(context.currentColumnIndex, startTag.getLength());

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), [parseAttribute(`b="c"`, 3)]);
            assert.deepEqual(startTag.getRightAngleBracket(), xml.RightAngleBracket(8));

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index && index < startTag.afterEndIndex; });
        });

        test(`with "<a  b =  "c" >"`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                parseWhitespace("  ", 2),
                parseAttribute(`b =  "c"`, 4),
                parseWhitespace(" ", 12),
                xml.RightAngleBracket(13)]));
            basicSegmentTests(startTag, 0, `<a  b =  "c" >`);
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), `<a b="c">`);
            assert.deepEqual(context.currentColumnIndex, 9);

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), [parseAttribute(`b =  "c"`, 4)]);
            assert.deepEqual(startTag.getRightAngleBracket(), xml.RightAngleBracket(13));

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index && index < startTag.afterEndIndex; });
        });

        test(`with ${qub.escapeAndQuote(`<a\nb\n=\n"c"\n>`)}`, () => {
            const startTag = new xml.StartTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                parseNewLine("\n", 2),
                parseAttribute(`b\n=\n"c"`, 3),
                parseNewLine("\n", 10),
                xml.RightAngleBracket(11)]));
            basicSegmentTests(startTag, 0, `<a\nb\n=\n"c"\n>`);
            const context = new xml.FormatContext();
            assert.deepEqual(startTag.format(context), `<a\n  b\n  =\n  "c"\n  >`, "Wrong format()");
            assert.deepEqual(context.currentColumnIndex, 3);

            assert.deepEqual(startTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(startTag.getName(), parseName("a", 1));
            assert.deepEqual(startTag.attributes.toArray(), [parseAttribute(`b\n=\n"c"`, 3)]);
            assert.deepEqual(startTag.getRightAngleBracket(), xml.RightAngleBracket(11));

            testContainsIndex(startTag, (index: number) => { return startTag.startIndex < index && index < startTag.afterEndIndex; });
        });
    });

    suite("EndTag", () => {
        test(`with "</"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1)]));
            basicSegmentTests(endTag, 0, "</");
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), "</");
            assert.deepEqual(context.currentColumnIndex, endTag.getLength());

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, undefined);
            assert.deepEqual(endTag.getRightAngleBracket(), undefined);

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index; });
        });

        test(`with "</)"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseUnrecognized(")", 2)]));
            basicSegmentTests(endTag, 0, "</)");
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), "</)");
            assert.deepEqual(context.currentColumnIndex, endTag.getLength());

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, undefined);
            assert.deepEqual(endTag.getRightAngleBracket(), undefined);

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index; });
        });

        test(`with "</a"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2)]));
            basicSegmentTests(endTag, 0, "</a");
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), "</a");
            assert.deepEqual(context.currentColumnIndex, endTag.getLength());

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, parseName("a", 2));
            assert.deepEqual(endTag.getRightAngleBracket(), undefined);

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index; });
        });

        test(`with "</a>"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ForwardSlash(1),
                parseName("a", 2),
                xml.RightAngleBracket(3)]));
            basicSegmentTests(endTag, 0, `</a>`);
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), `</a>`);
            assert.deepEqual(context.currentColumnIndex, endTag.getLength());

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, parseName("a", 2));
            assert.deepEqual(endTag.getRightAngleBracket(), xml.RightAngleBracket(3));

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index && index < endTag.afterEndIndex; });
        });

        test(`with "</ a>"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ForwardSlash(1),
                parseWhitespace(" ", 2),
                parseAttribute("a", 3),
                xml.RightAngleBracket(4)]));
            basicSegmentTests(endTag, 0, `</ a>`);
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), `</ a>`);
            assert.deepEqual(context.currentColumnIndex, endTag.getLength());

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, undefined);
            assert.deepEqual(endTag.getRightAngleBracket(), xml.RightAngleBracket(4));

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index && index < endTag.afterEndIndex; });
        });

        test(`with "</ a = "b">"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ForwardSlash(1),
                parseWhitespace(" ", 2),
                parseAttribute(`a = "b"`, 3),
                xml.RightAngleBracket(10)]));
            basicSegmentTests(endTag, 0, `</ a = "b">`);
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), `</ a="b">`);
            assert.deepEqual(context.currentColumnIndex, 9);

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, undefined);
            assert.deepEqual(endTag.getRightAngleBracket(), xml.RightAngleBracket(10));

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index && index < endTag.afterEndIndex; });
        });

        test(`with "</end  >"`, () => {
            const endTag = new xml.EndTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ForwardSlash(1),
                parseName("end", 2),
                parseWhitespace("  ", 5),
                xml.RightAngleBracket(7)]));
            basicSegmentTests(endTag, 0, `</end  >`);
            const context = new xml.FormatContext();
            assert.deepEqual(endTag.format(context), `</end>`);
            assert.deepEqual(context.currentColumnIndex, 6);

            assert.deepEqual(endTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(endTag.forwardSlash, xml.ForwardSlash(1));
            assert.deepEqual(endTag.name, parseName("end", 2));
            assert.deepEqual(endTag.getRightAngleBracket(), xml.RightAngleBracket(7));

            testContainsIndex(endTag, (index: number) => { return endTag.startIndex < index && index < endTag.afterEndIndex; });
        });
    });

    suite("EmptyElement", () => {
        test(`with "<a/"`, () => {
            const emptyTag = new xml.EmptyElement(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                xml.ForwardSlash(2)
            ]));
            basicSegmentTests(emptyTag, 0, "<a/");
            const context = new xml.FormatContext();
            assert.deepEqual(emptyTag.format(context), "<a/");
            assert.deepEqual(context.currentColumnIndex, emptyTag.getLength());

            assert.deepEqual(emptyTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(emptyTag.getName(), parseName("a", 1));
            assert.deepEqual(emptyTag.attributes.toArray(), []);
            assert.deepEqual(emptyTag.forwardSlash, xml.ForwardSlash(2));
            assert.deepEqual(emptyTag.getRightAngleBracket(), undefined);

            testContainsIndex(emptyTag, (index: number) => { return emptyTag.startIndex < index; });
        });

        test(`with "<a/>"`, () => {
            const emptyTag = new xml.EmptyElement(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                xml.ForwardSlash(2),
                xml.RightAngleBracket(3)
            ]));
            basicSegmentTests(emptyTag, 0, "<a/>");
            const context = new xml.FormatContext();
            assert.deepEqual(emptyTag.format(context), "<a/>");
            assert.deepEqual(context.currentColumnIndex, emptyTag.getLength());

            assert.deepEqual(emptyTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(emptyTag.getName(), parseName("a", 1));
            assert.deepEqual(emptyTag.attributes.toArray(), []);
            assert.deepEqual(emptyTag.forwardSlash, xml.ForwardSlash(2));
            assert.deepEqual(emptyTag.getRightAngleBracket(), xml.RightAngleBracket(3));

            testContainsIndex(emptyTag, (index: number) => { return emptyTag.startIndex < index && index < emptyTag.afterEndIndex; });
        });

        test(`with "<a b="c" />"`, () => {
            const emptyTag = new xml.EmptyElement(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                parseWhitespace(" ", 2),
                parseAttribute(`b="c"`, 3),
                parseWhitespace(" ", 8),
                xml.ForwardSlash(9),
                xml.RightAngleBracket(10)]));
            basicSegmentTests(emptyTag, 0, `<a b="c" />`);
            const context = new xml.FormatContext();
            assert.deepEqual(emptyTag.format(context), `<a b="c" />`);
            assert.deepEqual(context.currentColumnIndex, emptyTag.getLength());

            assert.deepEqual(emptyTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(emptyTag.getName(), parseName("a", 1));
            assert.deepEqual(emptyTag.attributes.toArray(), [parseAttribute(`b="c"`, 3)]);
            assert.deepEqual(emptyTag.forwardSlash, xml.ForwardSlash(9));
            assert.deepEqual(emptyTag.getRightAngleBracket(), xml.RightAngleBracket(10));

            testContainsIndex(emptyTag, (index: number) => { return emptyTag.startIndex < index && index < emptyTag.afterEndIndex; });
        });

        test(`with ${qub.escapeAndQuote(`<a\nb\n=\n"c"\n/>`)}`, () => {
            const emptyTag = new xml.EmptyElement(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseName("a", 1),
                parseNewLine("\n", 2),
                parseAttribute(`b\n=\n"c"`, 3),
                parseNewLine("\n", 10),
                xml.ForwardSlash(11),
                xml.RightAngleBracket(12)]));
            basicSegmentTests(emptyTag, 0, `<a\nb\n=\n"c"\n/>`);
            const context = new xml.FormatContext();
            assert.deepEqual(emptyTag.format(context), `<a\n  b\n  =\n  "c"\n  />`);
            assert.deepEqual(context.currentColumnIndex, 4);

            assert.deepEqual(emptyTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(emptyTag.getName(), parseName("a", 1));
            assert.deepEqual(emptyTag.attributes.toArray(), [parseAttribute(`b\n=\n"c"`, 3)]);
            assert.deepEqual(emptyTag.forwardSlash, xml.ForwardSlash(11));
            assert.deepEqual(emptyTag.getRightAngleBracket(), xml.RightAngleBracket(12));

            testContainsIndex(emptyTag, (index: number) => { return emptyTag.startIndex < index && index < emptyTag.afterEndIndex; });
        });
    });

    suite("UnrecognizedTag", () => {
        test(`with "<"`, () => {
            const unrecognizedTag = new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0)]));
            basicSegmentTests(unrecognizedTag, 0, "<");
            const context = new xml.FormatContext();
            assert.deepEqual(unrecognizedTag.format(context), "<");
            assert.deepEqual(context.currentColumnIndex, unrecognizedTag.getLength());

            assert.deepEqual(unrecognizedTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(unrecognizedTag.getRightAngleBracket(), undefined);

            testContainsIndex(unrecognizedTag, (index: number) => { return unrecognizedTag.startIndex < index; });
        });

        test(`with "<>"`, () => {
            const unrecognizedTag = new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.RightAngleBracket(1)]));
            basicSegmentTests(unrecognizedTag, 0, "<>");
            const context = new xml.FormatContext();
            assert.deepEqual(unrecognizedTag.format(context), "<>");
            assert.deepEqual(context.currentColumnIndex, unrecognizedTag.getLength());

            assert.deepEqual(unrecognizedTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(unrecognizedTag.getRightAngleBracket(), xml.RightAngleBracket(1));

            testContainsIndex(unrecognizedTag, (index: number) => { return unrecognizedTag.startIndex < index && index < unrecognizedTag.afterEndIndex; });
        });

        test(`with "< >"`, () => {
            const unrecognizedTag = new xml.UnrecognizedTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseWhitespace(" ", 1),
                xml.RightAngleBracket(2)]));
            basicSegmentTests(unrecognizedTag, 0, `< >`);
            const context = new xml.FormatContext();
            assert.deepEqual(unrecognizedTag.format(context), `<>`);
            assert.deepEqual(context.currentColumnIndex, 2);

            assert.deepEqual(unrecognizedTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(unrecognizedTag.getRightAngleBracket(), xml.RightAngleBracket(2));

            testContainsIndex(unrecognizedTag, (index: number) => { return unrecognizedTag.startIndex < index && index < unrecognizedTag.afterEndIndex; });
        });

        test(`with "< hello . =>"`, () => {
            const unrecognizedTag = new xml.UnrecognizedTag(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                parseWhitespace(" ", 1),
                parseAttribute(`hello `, 2),
                xml.Period(8),
                parseWhitespace(" ", 9),
                xml.Equals(10),
                xml.RightAngleBracket(11)]));
            basicSegmentTests(unrecognizedTag, 0, `< hello . =>`);
            const context = new xml.FormatContext();
            assert.deepEqual(unrecognizedTag.format(context), `< hello. =>`);
            assert.deepEqual(context.currentColumnIndex, 11);

            assert.deepEqual(unrecognizedTag.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(unrecognizedTag.getRightAngleBracket(), xml.RightAngleBracket(11));

            testContainsIndex(unrecognizedTag, (index: number) => { return unrecognizedTag.startIndex < index && index < unrecognizedTag.afterEndIndex; });
        });
    });

    suite("InternalDefinition", () => {
        test(`with null`, () => {
            assert.throws(() => { new xml.InternalDefinition(null); });
        });

        test(`with undefined`, () => {
            assert.throws(() => { new xml.InternalDefinition(undefined); });
        });

        test(`with ""`, () => {
            assert.throws(() => { new xml.InternalDefinition(new qub.ArrayList<xml.Segment>()); });
        });

        function internalDefitionTest(text: string, expectedLeftSquareBracket: xml.Lex, expectedRightSquareBracket?: xml.Lex): void {
            test(`with ${qub.escapeAndQuote(text)}`, () => {
                const internalDefinition = new xml.InternalDefinition(parseXmlLexes(text));
                basicSegmentTests(internalDefinition, 0, text);

                assert.deepEqual(internalDefinition.leftSquareBracket, expectedLeftSquareBracket);
                assert.deepEqual(internalDefinition.rightSquareBracket, expectedRightSquareBracket);

                testContainsIndex(internalDefinition, (index: number) => { return internalDefinition.startIndex < index && (!expectedRightSquareBracket || index < internalDefinition.afterEndIndex); });
            });
        }

        internalDefitionTest("[", xml.LeftSquareBracket(0));
        internalDefitionTest("[ ", xml.LeftSquareBracket(0));
        internalDefitionTest("[]", xml.LeftSquareBracket(0), xml.RightSquareBracket(1));
        internalDefitionTest("[ ]", xml.LeftSquareBracket(0), xml.RightSquareBracket(2));
    });

    suite("DOCTYPE", () => {
        test(`with "<!DOCTYPE"`, () => {
            const doctype = new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseLetters("DOCTYPE", 2)]));
            basicSegmentTests(doctype, 0, "<!DOCTYPE");
            const context = new xml.FormatContext();
            assert.deepEqual(doctype.format(context), "<!DOCTYPE", "Wrong format().");
            assert.deepEqual(context.currentColumnIndex, 9);

            assert.deepEqual(doctype.name, parseLetters("DOCTYPE", 2), "Wrong name.");
            assert.deepEqual(doctype.leftAngleBracket, xml.LeftAngleBracket(0), "Wrong leftAngleBracket.");
            assert.deepEqual(doctype.getRightAngleBracket(), undefined, "Wrong rightAngleBracket.");

            testContainsIndex(doctype, (index: number) => { return doctype.startIndex < index; });
        });

        test(`with "<!DOCTYPE>"`, () => {
            const doctype = new xml.DOCTYPE(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                parseLetters("DOCTYPE", 2),
                xml.RightAngleBracket(9)]));
            basicSegmentTests(doctype, 0, "<!DOCTYPE>");
            const context = new xml.FormatContext();
            assert.deepEqual(doctype.format(context), "<!DOCTYPE>");
            assert.deepEqual(context.currentColumnIndex, 10);

            assert.deepEqual(doctype.name, parseLetters("DOCTYPE", 2));
            assert.deepEqual(doctype.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(doctype.getRightAngleBracket(), xml.RightAngleBracket(9));

            testContainsIndex(doctype, (index: number) => { return doctype.startIndex < index && index < doctype.afterEndIndex; });
        });

        test(`with "<!DOCTYPE root>"`, () => {
            const doctype = new xml.DOCTYPE(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                parseLetters("DOCTYPE", 2),
                parseWhitespace(" ", 9),
                parseLetters("root", 10),
                xml.RightAngleBracket(14)]));
            basicSegmentTests(doctype, 0, `<!DOCTYPE root>`);
            const context = new xml.FormatContext();
            assert.deepEqual(doctype.format(context), `<!DOCTYPE root>`);
            assert.deepEqual(context.currentColumnIndex, 15);

            assert.deepEqual(doctype.name, parseLetters("DOCTYPE", 2));
            assert.deepEqual(doctype.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(doctype.getRightAngleBracket(), xml.RightAngleBracket(14));

            testContainsIndex(doctype, (index: number) => { return doctype.startIndex < index && index < doctype.afterEndIndex; });
        });

        test(`with "<!DOCTYPE    root   >"`, () => {
            const doctype = new xml.DOCTYPE(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                parseLetters("DOCTYPE", 2),
                parseWhitespace("    ", 9),
                parseLetters("root", 13),
                parseWhitespace("   ", 17),
                xml.RightAngleBracket(20)]));
            basicSegmentTests(doctype, 0, `<!DOCTYPE    root   >`);
            const context = new xml.FormatContext();
            assert.deepEqual(doctype.format(context), `<!DOCTYPE root>`, "Wrong format.");
            assert.deepEqual(context.currentColumnIndex, 15);

            assert.deepEqual(doctype.name, parseLetters("DOCTYPE", 2));
            assert.deepEqual(doctype.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(doctype.getRightAngleBracket(), xml.RightAngleBracket(20));

            testContainsIndex(doctype, (index: number) => { return doctype.startIndex < index && index < doctype.afterEndIndex; });
        });
    });

    suite("Comment", () => {
        test(`with "<!--"`, () => {
            const comment = new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3)]));
            basicSegmentTests(comment, 0, "<!--");
            const context = new xml.FormatContext();
            assert.deepEqual(comment.format(context), "<!--");
            assert.deepEqual(context.currentColumnIndex, 4);
            assert.deepEqual(comment.getRightAngleBracket(), undefined);
            assert.deepEqual(comment.contentSegments.toArray(), []);
            assert.deepEqual(comment.contentText, "");

            testContainsIndex(comment, (index: number) => { return comment.startIndex < index; });
        });

        test(`with "<!-- -->"`, () => {
            const comment = new xml.Comment(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.Dash(2),
                xml.Dash(3),
                parseWhitespace(" ", 4),
                xml.Dash(5),
                xml.Dash(6),
                xml.RightAngleBracket(7)]));
            basicSegmentTests(comment, 0, "<!-- -->");
            const context = new xml.FormatContext();
            assert.deepEqual(comment.format(context), "<!-- -->");
            assert.deepEqual(context.currentColumnIndex, 8);
            assert.deepEqual(comment.getRightAngleBracket(), xml.RightAngleBracket(7));
            assert.deepEqual(comment.contentSegments.toArray(), [parseWhitespace(" ", 4)]);
            assert.deepEqual(comment.contentText, " ");

            testContainsIndex(comment, (index: number) => { return comment.startIndex < index && index < comment.afterEndIndex; });
        });

        test(`with "<!-- ->"`, () => {
            const comment = new xml.Comment(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.Dash(2),
                xml.Dash(3),
                parseWhitespace(" ", 4),
                xml.Dash(5),
                xml.RightAngleBracket(6)]));
            basicSegmentTests(comment, 0, `<!-- ->`);
            const context = new xml.FormatContext();
            assert.deepEqual(comment.format(context), `<!-- ->`);
            assert.deepEqual(context.currentColumnIndex, 7);
            assert.deepEqual(comment.getRightAngleBracket(), undefined);
            assert.deepEqual(comment.contentSegments.toArray(), comment.segments.skip(4).toArray());
            assert.deepEqual(comment.contentText, " ->");

            testContainsIndex(comment, (index: number) => { return comment.startIndex < index; });
        });
    });

    suite("ProcessingInstruction", () => {
        test(`with null`, () => {
            assert.throws(() => { new xml.ProcessingInstruction(null); });
        });

        test(`with undefined`, () => {
            assert.throws(() => { new xml.ProcessingInstruction(null); });
        });

        test(`with ""`, () => {
            assert.throws(() => { new xml.ProcessingInstruction(new qub.ArrayList<xml.Segment>()); });
        });

        test(`with "<"`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0)]));
            basicSegmentTests(pi, 0, "<");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<");
            assert.deepEqual(context.currentColumnIndex, 1);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, undefined);
            assert.deepEqual(pi.getRightAngleBracket(), undefined);

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index; });
        });

        test(`with "<?"`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1)]));
            basicSegmentTests(pi, 0, "<?");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<?");
            assert.deepEqual(context.currentColumnIndex, 2);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, undefined);
            assert.deepEqual(pi.getRightAngleBracket(), undefined);

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index; });
        });

        test(`with "<? "`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2)]));
            basicSegmentTests(pi, 0, "<? ");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<?");
            assert.deepEqual(context.currentColumnIndex, 2);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, undefined);
            assert.deepEqual(pi.getRightAngleBracket(), undefined);

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index; });
        });

        test(`with "<?hello:pi"`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("hello:pi", 2)]));
            basicSegmentTests(pi, 0, "<?hello:pi");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<?hello:pi");
            assert.deepEqual(context.currentColumnIndex, 10);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, parseName("hello:pi", 2));
            assert.deepEqual(pi.getRightAngleBracket(), undefined);

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index; });
        });

        test(`with "<?hello:pi 50 , "`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("hello:pi", 2),
                parseWhitespace(" ", 10),
                parseDigits("50", 11),
                parseWhitespace(" ", 13),
                parseUnrecognized(",", 14),
                parseWhitespace(" ", 15)
            ]));
            basicSegmentTests(pi, 0, "<?hello:pi 50 , ");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<?hello:pi 50 ,");
            assert.deepEqual(context.currentColumnIndex, 15);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, parseName("hello:pi", 2));
            assert.deepEqual(pi.getRightAngleBracket(), undefined);

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index; });
        });

        test(`with "<?hello:pi?>"`, () => {
            const pi = new xml.ProcessingInstruction(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("hello:pi", 2),
                xml.QuestionMark(10),
                xml.RightAngleBracket(11)
            ]));
            basicSegmentTests(pi, 0, "<?hello:pi?>");

            const context = new xml.FormatContext();
            assert.deepEqual(pi.format(context), "<?hello:pi?>");
            assert.deepEqual(context.currentColumnIndex, 12);

            assert.deepEqual(pi.leftAngleBracket, xml.LeftAngleBracket(0));
            assert.deepEqual(pi.name, parseName("hello:pi", 2));
            assert.deepEqual(pi.getRightAngleBracket(), xml.RightAngleBracket(11));

            testContainsIndex(pi, (index: number) => { return pi.startIndex < index && index < pi.afterEndIndex; });
        });
    });

    suite("CDATA", () => {
        test(`with "<![CDATA["`, () => {
            const cdata = new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseLetters("CDATA", 3),
                xml.LeftSquareBracket(8)]));
            basicSegmentTests(cdata, 0, "<![CDATA[");
            const context = new xml.FormatContext();
            assert.deepEqual(cdata.format(context), "<![CDATA[");
            assert.deepEqual(context.currentColumnIndex, 9);
            assert.deepEqual(cdata.dataSegments.toArray(), cdata.segments.skip(5).toArray());

            testContainsIndex(cdata, (index: number) => { return cdata.startIndex < index; });
        });

        test(`with "<![CDATA[ hello"`, () => {
            const cdata = new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseLetters("CDATA", 3),
                xml.LeftSquareBracket(8),
                parseWhitespace(" ", 9),
                parseLetters("hello", 10)]));
            basicSegmentTests(cdata, 0, "<![CDATA[ hello");
            const context = new xml.FormatContext();
            assert.deepEqual(cdata.format(context), "<![CDATA[ hello");
            assert.deepEqual(context.currentColumnIndex, 15);
            assert.deepEqual(cdata.dataSegments.toArray(), cdata.segments.skip(5).toArray());

            testContainsIndex(cdata, (index: number) => { return cdata.startIndex < index; });
        });

        test(`with "<![CDATA[]"`, () => {
            const cdata = new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseLetters("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightSquareBracket(9)]));
            basicSegmentTests(cdata, 0, "<![CDATA[]");
            const context = new xml.FormatContext();
            assert.deepEqual(cdata.format(context), "<![CDATA[]");
            assert.deepEqual(context.currentColumnIndex, 10);
            assert.deepEqual(cdata.dataSegments.toArray(), cdata.segments.skip(5).toArray());

            testContainsIndex(cdata, (index: number) => { return cdata.startIndex < index; });
        });

        test(`with "<![CDATA[]]"`, () => {
            const cdata = new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseLetters("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightSquareBracket(9),
                xml.RightSquareBracket(10)]));
            basicSegmentTests(cdata, 0, "<![CDATA[]]");
            const context = new xml.FormatContext();
            assert.deepEqual(cdata.format(context), "<![CDATA[]]");
            assert.deepEqual(context.currentColumnIndex, 11);
            assert.deepEqual(cdata.dataSegments.toArray(), cdata.segments.skip(5).toArray());

            testContainsIndex(cdata, (index: number) => { return cdata.startIndex < index; });
        });

        test(`with "<![CDATA[]]>"`, () => {
            const cdata = new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseLetters("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightSquareBracket(9),
                xml.RightSquareBracket(10),
                xml.RightAngleBracket(11)]));
            basicSegmentTests(cdata, 0, "<![CDATA[]]>");
            const context = new xml.FormatContext();
            assert.deepEqual(cdata.format(context), "<![CDATA[]]>");
            assert.deepEqual(context.currentColumnIndex, 12);
            assert.deepEqual(cdata.dataSegments.toArray(), cdata.segments.skip(5).skipLast(3).toArray());

            testContainsIndex(cdata, (index: number) => { return cdata.startIndex < index && index < cdata.afterEndIndex; });
        });
    });

    suite("Text", () => {
        function textTest(textString: string, expectedFormattedText: string = textString, nonWhitespaceSpan: qub.Span = expectedFormattedText ? new qub.Span(0, qub.getLength(expectedFormattedText)) : undefined): void {
            const expectedString: string = textString ? textString : "";
            const expectedLength: number = expectedString.length;

            test(`with ${qub.escapeAndQuote(textString)}`, () => {
                const text = new xml.Text(parseXmlLexes(textString, 0));
                assert.deepEqual(text.toString(), expectedString, "Wrong toString().");
                const context = new xml.FormatContext();
                assert.deepEqual(text.format(context), expectedFormattedText, "Wrong format()");
                assert.deepEqual(context.currentColumnIndex, expectedFormattedText.length);
                assert.deepEqual(text.isWhitespace(), textString.trim() === "", "Wrong isWhitespace().");

                assert.deepEqual(text.startIndex, 0);
                assert.deepEqual(text.getLength(), expectedLength);
                assert.deepEqual(text.afterEndIndex, expectedLength);
                assert.deepEqual(text.span, new qub.Span(0, expectedLength));
                assert.deepEqual(text.nonWhitespaceSpan, nonWhitespaceSpan);

                for (let i = -1; i <= text.afterEndIndex + 1; ++i) {
                    assert.deepEqual(text.containsIndex(i), text.startIndex <= i && i <= text.afterEndIndex);
                }
            });
        }

        textTest(" ", "");
        textTest("hello");
        textTest(" fun fun fun ", "fun fun fun", new qub.Span(1, 11));
    });

    suite("Tokenizer", () => {
        suite("constructor", () => {
            function constructorTest(text: string): void {
                test(`with ${qub.escapeAndQuote(text)}`, () => {
                    const tokenizer = new xml.Tokenizer(text);
                    assert.deepEqual(tokenizer.hasStarted(), false);
                });
            }

            constructorTest(null);
            constructorTest(undefined);
            constructorTest("");
            constructorTest("test");
        });

        suite("next()", () => {
            function nextTest(text: string, expectedSegments: xml.Segment | xml.Segment[] = [], expectedIssues: qub.Issue[] = []): void {
                if (expectedSegments instanceof xml.Segment) {
                    expectedSegments = [expectedSegments];
                }

                test(`with ${qub.quote(qub.escape(text))}`, () => {
                    const tokenizer = new xml.Tokenizer(text);

                    for (const expectedSegment of expectedSegments as xml.Segment[]) {
                        assert.deepEqual(tokenizer.next(), true, "Expected more segments, next() was false.");
                        assert.deepEqual(tokenizer.hasStarted(), true, "Expected more segments, hasStarted() was false.");
                        assert.deepEqual(tokenizer.getCurrent(), expectedSegment);
                    }

                    for (let i: number = 0; i < 2; ++i) {
                        assert.deepEqual(tokenizer.next(), false, "Expected no more segments, next() was true.");
                        assert.deepEqual(tokenizer.hasStarted(), true, "Expected no more segments, hasStarted() was false.");
                        assert.deepEqual(tokenizer.getCurrent(), undefined);
                    }
                });

                test(`with ${qub.quote(qub.escape(text))} and issues`, () => {
                    const issues = new qub.ArrayList<qub.Issue>();
                    const tokenizer = new xml.Tokenizer(text, 0, issues);

                    for (const expectedSegment of expectedSegments as xml.Segment[]) {
                        assert.deepEqual(tokenizer.next(), true, "Expected more segments, next() was false.");
                        assert.deepEqual(tokenizer.hasStarted(), true, "Expected more segments, hasStarted() was false.");
                        assert.deepEqual(tokenizer.getCurrent(), expectedSegment);
                    }

                    for (let i: number = 0; i < 2; ++i) {
                        assert.deepEqual(tokenizer.next(), false, "Expected no more segments, next() was true.");
                        assert.deepEqual(tokenizer.hasStarted(), true, "Expected no more segments, hasStarted() was false.");
                        assert.deepEqual(tokenizer.getCurrent(), undefined);
                    }

                    assert.deepEqual(issues.toArray(), expectedIssues);
                });
            }

            nextTest(null);
            nextTest(undefined);
            nextTest("");

            nextTest("<",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0)])),
                [
                    xml.Issues.missingNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(0, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(">", parseText(">"));
            nextTest("[", parseText("["));
            nextTest("]", parseText("]"));
            nextTest("?", parseText("?"));
            nextTest("!", parseText("!"));
            nextTest("-", parseText("-"));
            nextTest(`'`, parseText(`'`));
            nextTest(`"`, parseText(`"`));
            nextTest("=", parseText("="));
            nextTest("_", parseText("_"));
            nextTest(":", parseText(":"));
            nextTest(";", parseText(";"));
            nextTest("&", parseText("&"));
            nextTest("/", parseText("/"));

            nextTest(" ", parseText(" "));
            nextTest("   ", parseText("   "));
            nextTest("\t", parseText("\t"));
            nextTest(" \t\r ", parseText(" \t\r "));

            nextTest("\n", parseNewLine("\n"));
            nextTest("\r\n", parseNewLine("\r\n"));

            nextTest(".", parseText("."));

            nextTest("hello there", parseText("hello there"));

            nextTest("<>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.RightAngleBracket(1)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest("< ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<  ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace("  ", 1)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 2)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("< >",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), xml.RightAngleBracket(2)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest("<  >",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace("  ", 1), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 2))
                ]);
            nextTest("< a>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), parseLetters("a", 2), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest("< .>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), xml.Period(2), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest(`< ">`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), parseQuotedString(`">`, 2)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`< "">`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), parseQuotedString(`""`, 2), xml.RightAngleBracket(4)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest(`< '>`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), parseQuotedString(`'>`, 2)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`< ''>`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseWhitespace(" ", 1), parseQuotedString(`''`, 2), xml.RightAngleBracket(4)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1))
                ]);
            nextTest(`<9`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseDigits("9", 1)])),
                [
                    xml.Issues.expectedNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(1, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);

            nextTest("<a",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1)])),
                [xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a>", new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.RightAngleBracket(2)])));
            nextTest("<_>", new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("_", 1), xml.RightAngleBracket(2)])));
            nextTest("<:>", new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName(":", 1), xml.RightAngleBracket(2)])));
            nextTest("<a5",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1)])),
                [xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a:5",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a:5", 1)])),
                [xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a::5",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a::5", 1)])),
                [xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a5>", new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), xml.RightAngleBracket(3)])));
            nextTest("<a5  >", new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), parseWhitespace("  ", 3), xml.RightAngleBracket(5)])));
            nextTest("<a5 ()",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), parseWhitespace(" ", 3), parseUnrecognized("(", 4), parseUnrecognized(")", 5)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(5, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a5 ()>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), parseWhitespace(" ", 3), parseUnrecognized("(", 4), parseUnrecognized(")", 5), xml.RightAngleBracket(6)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(5, 1))
                ]);
            nextTest("<a b>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b", 3), xml.RightAngleBracket(4)])),
                [xml.Issues.expectedAttributeEqualsSign(new qub.Span(4, 1))]);
            nextTest("<a b >",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b ", 3), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedAttributeEqualsSign(new qub.Span(5, 1))]);
            nextTest("<a b",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b", 3)])),
                [
                    xml.Issues.missingAttributeEqualsSign(new qub.Span(3, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a b ",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b ", 3)])),
                [
                    xml.Issues.missingAttributeEqualsSign(new qub.Span(3, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a b)",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b", 3), parseUnrecognized(")", 4)])),
                [
                    xml.Issues.expectedAttributeEqualsSign(new qub.Span(4, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a b=-",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b=", 3), xml.Dash(5)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(5, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a b =>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b =", 3), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedAttributeValue(new qub.Span(6, 1))]);
            nextTest("<a b=.",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b=", 3), xml.Period(5)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(5, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a b= .",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b= ", 3), xml.Period(6)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(6, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a=",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.Equals(2)])),
                [
                    xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(2, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a=>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.Equals(2), xml.RightAngleBracket(3)])),
                [xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(2, 1))]);
            nextTest("<a'",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseQuotedString(`'`, 2)])),
                [
                    xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(2, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a''",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseQuotedString(`''`, 2)])),
                [
                    xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(2, 2)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a''>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseQuotedString(`''`, 2), xml.RightAngleBracket(4)])),
                [xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(2, 2))]);
            nextTest("<a '' >",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseQuotedString(`''`, 3), parseWhitespace(" ", 5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 2))]);
            nextTest("<a =>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), xml.RightAngleBracket(4)])),
                [xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1))]);
            nextTest("<a ='>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseQuotedString(`'>`, 4)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 2)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<a =''>",
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseQuotedString(`''`, 4), xml.RightAngleBracket(6)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 2))
                ]);
            nextTest(`<a =">`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseQuotedString(`">`, 4)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 2)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<a ="">`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseQuotedString(`""`, 4), xml.RightAngleBracket(6)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 2))
                ]);
            nextTest(`<a b"">`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b`, 3), parseQuotedString(`""`, 4), xml.RightAngleBracket(6)])),
                [
                    xml.Issues.expectedAttributeEqualsSign(new qub.Span(4, 1))
                ]);
            nextTest(`<a b "" >`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b `, 3), parseQuotedString(`""`, 5), parseWhitespace(" ", 7), xml.RightAngleBracket(8)])),
                [xml.Issues.expectedAttributeEqualsSign(new qub.Span(5, 1))]);
            nextTest(`<a b="`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b="`, 3)])),
                [
                    xml.Issues.missingQuotedStringEndQuote(new qub.Span(5, 1)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<a b=">`,
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=">`, 3)])),
                [
                    xml.Issues.missingQuotedStringEndQuote(new qub.Span(5, 2)),
                    xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<a b="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=""`, 3), xml.RightAngleBracket(7)])));
            nextTest(`<a b=""%>`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=""`, 3), parseUnrecognized("%", 7), xml.RightAngleBracket(8)])),
                [xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(7, 1))]);
            nextTest(`<a b=""%c="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=""`, 3), parseUnrecognized("%", 7), parseAttribute(`c=""`, 8), xml.RightAngleBracket(12)])),
                [xml.Issues.expectedWhitespaceStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(7, 1))]);
            nextTest(`<a b=""c="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=""`, 3), parseAttribute(`c=""`, 7), xml.RightAngleBracket(11)])),
                [xml.Issues.expectedWhitespaceBetweenAttributes(new qub.Span(7, 1))]);
            nextTest(`<a _="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`_=""`, 3), xml.RightAngleBracket(7)])));
            nextTest(`<a :="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`:=""`, 3), xml.RightAngleBracket(7)])));
            nextTest(`<a b=''>`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=''`, 3), xml.RightAngleBracket(7)])));
            nextTest(`<a b:5="">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b:5=""`, 3), xml.RightAngleBracket(9)])));
            nextTest(`<a b="'">`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b="'"`, 3), xml.RightAngleBracket(8)])));
            nextTest(`<a b='"'>`, new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b='"'`, 3), xml.RightAngleBracket(8)])));
            nextTest(`<a b='' c="">`, new xml.StartTag(
                new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    parseName("a", 1),
                    parseWhitespace(" ", 2),
                    parseAttribute(`b=''`, 3),
                    parseWhitespace(" ", 7),
                    parseAttribute(`c=""`, 8),
                    xml.RightAngleBracket(12)
                ])));

            nextTest("</",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1)])),
                [
                    xml.Issues.missingEndTagName(new qub.Span(1, 1)),
                    xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("</ ",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseWhitespace(" ", 2)])),
                [
                    xml.Issues.expectedEndTagName(new qub.Span(2, 1)),
                    xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("</>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), xml.RightAngleBracket(2)])),
                [xml.Issues.expectedEndTagName(new qub.Span(2, 1))]);
            nextTest("</ >",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseWhitespace(" ", 2), xml.RightAngleBracket(3)])),
                [xml.Issues.expectedEndTagName(new qub.Span(2, 1))]);
            nextTest("</500>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseDigits("500", 2), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedEndTagName(new qub.Span(2, 3))]);
            nextTest("</a5",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a5", 2)])),
                [xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("</a5 ",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a5", 2), parseWhitespace(" ", 4)])),
                [xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("</a5>", new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a5", 2), xml.RightAngleBracket(4)])));
            nextTest("</a5  >", new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a5", 2), parseWhitespace("  ", 4), xml.RightAngleBracket(6)])));
            nextTest("</a5 ()>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a5", 2), parseWhitespace(" ", 4), parseUnrecognized("(", 5), parseUnrecognized(")", 6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(5, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest("</a b",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters("b", 4)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("</a b>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters("b", 4), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);
            nextTest("</a b >",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters("b", 4), parseWhitespace(" ", 5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);
            nextTest("</a b )>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters("b", 4), parseWhitespace(" ", 5), parseUnrecognized(")", 6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest("</a b =>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters("b", 4), parseWhitespace(" ", 5), xml.Equals(6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest(`</a b="">`,
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters(`b`, 4), xml.Equals(5), xml.DoubleQuote(6), xml.DoubleQuote(7), xml.RightAngleBracket(8)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(5, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(7, 1))
                ]);
            nextTest(`</a b=''>`,
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters(`b`, 4), xml.Equals(5), xml.SingleQuote(6), xml.SingleQuote(7), xml.RightAngleBracket(8)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(5, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(7, 1))
                ]);
            nextTest(`</a b='>'>`,
                [
                    new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), parseLetters(`b`, 4), xml.Equals(5), xml.SingleQuote(6), xml.RightAngleBracket(7)])),
                    new xml.Text(new qub.ArrayList([xml.SingleQuote(8), xml.RightAngleBracket(9)]))
                ],
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(5, 1)),
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest("</a .",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Period(4)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("</a .>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Period(4), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);
            nextTest("</a . >",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Period(4), parseWhitespace(" ", 5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);
            nextTest("</a =",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Equals(4)])),
                [
                    xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.missingEndTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("</a =>",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Equals(4), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);
            nextTest("</a = >",
                new xml.EndTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ForwardSlash(1), parseName("a", 2), parseWhitespace(" ", 3), xml.Equals(4), parseWhitespace(" ", 5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedEndTagRightAngleBracket(new qub.Span(4, 1))]);

            nextTest("<a/",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.ForwardSlash(2)])),
                [xml.Issues.missingEmptyElementRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a/>", new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.ForwardSlash(2), xml.RightAngleBracket(3)])));
            nextTest("<a/ >",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.ForwardSlash(2), parseWhitespace(" ", 3), xml.RightAngleBracket(4)])),
                [xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(3, 1))]);
            nextTest("<a//>",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), xml.ForwardSlash(2), xml.ForwardSlash(3), xml.RightAngleBracket(4)])),
                [xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(3, 1))]);
            nextTest("<a / b='c'>",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.ForwardSlash(3), parseWhitespace(" ", 4), parseLetters("b", 5), xml.Equals(6), parseQuotedString("'c'", 7), xml.RightAngleBracket(10)])),
                [
                    xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(4, 1)),
                    xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(5, 1)),
                    xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(6, 1)),
                    xml.Issues.expectedEmptyElementRightAngleBracket(new qub.Span(7, 3))
                ]);
            nextTest("<a5/",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), xml.ForwardSlash(3)])),
                [xml.Issues.missingEmptyElementRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<a5/>", new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), xml.ForwardSlash(3), xml.RightAngleBracket(4)])));
            nextTest("<a5  />", new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), parseWhitespace("  ", 3), xml.ForwardSlash(5), xml.RightAngleBracket(6)])));
            nextTest("<a5 ()/>",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a5", 1), parseWhitespace(" ", 3), parseUnrecognized("(", 4), parseUnrecognized(")", 5), xml.ForwardSlash(6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(5, 1))
                ]);
            nextTest("<a b/>",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b", 3), xml.ForwardSlash(4), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedAttributeEqualsSign(new qub.Span(4, 1))]);
            nextTest("<a b />",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b ", 3), xml.ForwardSlash(5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedAttributeEqualsSign(new qub.Span(5, 1))]);
            nextTest("<a b =/>",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute("b =", 3), xml.ForwardSlash(6), xml.RightAngleBracket(7)])),
                [xml.Issues.expectedAttributeValue(new qub.Span(6, 1))]);
            nextTest(`<a b=""/>`, new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=""`, 3), xml.ForwardSlash(7), xml.RightAngleBracket(8)])));
            nextTest("<a = />",
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseWhitespace(" ", 4), xml.ForwardSlash(5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1))]);
            nextTest(`<a =''/>`,
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), xml.Equals(3), parseQuotedString(`''`, 4), xml.ForwardSlash(6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 1)),
                    xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(4, 2))
                ]);
            nextTest(`<a ''/>`,
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseQuotedString(`''`, 3), xml.ForwardSlash(5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 2))]);
            nextTest(`<a 'test'/>`,
                new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseQuotedString(`'test'`, 3), xml.ForwardSlash(9), xml.RightAngleBracket(10)])),
                [xml.Issues.expectedAttributeNameStartTagRightAngleBracketOrEmptyElementForwardSlash(new qub.Span(3, 6))]);
            nextTest(`<a b=''/>`, new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=''`, 3), xml.ForwardSlash(7), xml.RightAngleBracket(8)])));
            nextTest(`<a b='' />`, new xml.EmptyElement(new qub.ArrayList([xml.LeftAngleBracket(0), parseName("a", 1), parseWhitespace(" ", 2), parseAttribute(`b=''`, 3), parseWhitespace(" ", 7), xml.ForwardSlash(8), xml.RightAngleBracket(9)])));
            nextTest(`<a b='' c=""/>`, new xml.EmptyElement(
                new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    parseName("a", 1),
                    parseWhitespace(" ", 2),
                    parseAttribute(`b=''`, 3),
                    parseWhitespace(" ", 7),
                    parseAttribute(`c=""`, 8),
                    xml.ForwardSlash(12),
                    xml.RightAngleBracket(13)
                ])));

            nextTest("<?",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1)])),
                [
                    xml.Issues.missingDeclarationOrProcessingInstructionName(new qub.Span(1, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? a",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? a=",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.Equals(4)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? a=?",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.Equals(4), xml.QuestionMark(5)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? a=?>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.Equals(4), xml.QuestionMark(5), xml.RightAngleBracket(6)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<? a='' ? ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.Equals(4), parseQuotedString(`''`, 5), parseWhitespace(" ", 7), xml.QuestionMark(8), parseWhitespace(" ", 9)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? a='' ? >", new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.Equals(4), parseQuotedString(`''`, 5), parseWhitespace(" ", 7), xml.QuestionMark(8), parseWhitespace(" ", 9), xml.RightAngleBracket(10)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<? a?",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), parseLetters("a", 3), xml.QuestionMark(4)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), xml.RightAngleBracket(2)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<? >",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<??",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), xml.QuestionMark(2)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<??>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), xml.QuestionMark(2), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<? ?",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), xml.QuestionMark(3)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<? ?>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseWhitespace(" ", 2), xml.QuestionMark(3), xml.RightAngleBracket(4)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 1))
                ]);
            nextTest("<?xml",
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2)])),
                [
                    xml.Issues.missingDeclarationVersionAttribute(new qub.Span(2, 3)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?xml>",
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.RightAngleBracket(5)])),
                [
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(5, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
                ]);
            nextTest("<?abc",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2)])),
                [
                    xml.Issues.missingProcessingInstructionRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingProcessingInstructionRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?abc ",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2), parseWhitespace(" ", 5)])),
                [
                    xml.Issues.missingProcessingInstructionRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingProcessingInstructionRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?abc>",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2), xml.RightAngleBracket(5)])),
                [xml.Issues.expectedProcessingInstructionRightQuestionMark(new qub.Span(5, 1))]);
            nextTest("<?abc?",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2), xml.QuestionMark(5)])),
                [xml.Issues.missingProcessingInstructionRightAngleBracket(new qub.Span(0, 1))]);
            nextTest("<?abc?>", new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2), xml.QuestionMark(5), xml.RightAngleBracket(6)])));
            nextTest("<?abc? >",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("abc", 2), xml.QuestionMark(5), parseWhitespace(" ", 6), xml.RightAngleBracket(7)])),
                [xml.Issues.expectedProcessingInstructionRightAngleBracket(new qub.Span(6, 1))]);
            nextTest("<?_",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("_", 2)])),
                [
                    xml.Issues.missingProcessingInstructionRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingProcessingInstructionRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?:",
                new xml.ProcessingInstruction(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName(":", 2)])),
                [
                    xml.Issues.missingProcessingInstructionRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingProcessingInstructionRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<?50",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseDigits("50", 2)])),
                [
                    xml.Issues.expectedDeclarationOrProcessingInstructionName(new qub.Span(2, 2)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a`, 6)])),
                [
                    xml.Issues.missingAttributeEqualsSign(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a `,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a `, 6)])),
                [
                    xml.Issues.missingAttributeEqualsSign(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a(`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a`, 6), parseUnrecognized("(", 7)])),
                [
                    xml.Issues.expectedAttributeEqualsSign(new qub.Span(7, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(new qub.Span(7, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a=(`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a=`, 6), parseUnrecognized("(", 8)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(8, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(new qub.Span(8, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a= ?`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a= `, 6), xml.QuestionMark(9)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(9, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a= ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a= `, 6), xml.QuestionMark(9), xml.RightAngleBracket(10)])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(9, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml ="test" ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), xml.Equals(6), parseQuotedString(`"test"`, 7), parseWhitespace(" ", 13), xml.QuestionMark(14), xml.RightAngleBracket(15)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(new qub.Span(7, 6))
                ]);
            nextTest(`<?xml version="1.0" `,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19)])),
                [
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" .`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), xml.Period(20)])),
                [
                    xml.Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(new qub.Span(20, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" >`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), xml.RightAngleBracket(20)])),
                [
                    xml.Issues.expectedDeclarationEncodingAttributeStandaloneAttributeOrRightQuestionMark(new qub.Span(20, 1))
                ]);
            nextTest(`<?xml version="1.0"encoding="utf-8"`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseAttribute(`encoding="utf-8"`, 19)])),
                [
                    xml.Issues.expectedWhitespaceBetweenAttributes(new qub.Span(19, 8)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" `,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`encoding="utf-8"`, 20), parseWhitespace(" ", 36)])),
                [
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" .`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`encoding="utf-8"`, 20), parseWhitespace(" ", 36), xml.Period(37)])),
                [
                    xml.Issues.expectedDeclarationStandaloneAttributeOrRightQuestionMark(new qub.Span(37, 1)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" >`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`encoding="utf-8"`, 20), parseWhitespace(" ", 36), xml.RightAngleBracket(37)])),
                [
                    xml.Issues.expectedDeclarationStandaloneAttributeOrRightQuestionMark(new qub.Span(37, 1))
                ]);
            nextTest(`<?xml version="1.0" standalone=`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=`, 20)])),
                [
                    xml.Issues.missingAttributeValue(new qub.Span(20, 10)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" standalone=""`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=""`, 20)])),
                [
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(31, 2)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" standalone=""?`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=""`, 20), xml.QuestionMark(33)])),
                [
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(31, 2)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" standalone="">`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=""`, 20), xml.RightAngleBracket(33)])),
                [
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(31, 2)),
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(33, 1))
                ]);
            nextTest(`<?xml version="1.0" standalone=""?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=""`, 20), xml.QuestionMark(33), xml.RightAngleBracket(34)])),
                [
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(31, 2))
                ]);
            nextTest(`<?xml version="1.0" standalone="" ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`version="1.0"`, 6), parseWhitespace(" ", 19), parseAttribute(`standalone=""`, 20), parseWhitespace(" ", 33), xml.QuestionMark(34), xml.RightAngleBracket(35)])),
                [
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(31, 2))
                ]);
            nextTest(`<?xml a="test" ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseAttribute(`a="test"`, 6), parseWhitespace(" ", 14), xml.QuestionMark(15), xml.RightAngleBracket(16)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml? >`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.QuestionMark(5), parseWhitespace(" ", 6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                    xml.Issues.expectedDeclarationRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml?\t>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.QuestionMark(5), parseWhitespace("\t", 6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                    xml.Issues.expectedDeclarationRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml . ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), xml.Period(6), parseWhitespace(" ", 7), xml.QuestionMark(8), xml.RightAngleBracket(9)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml "" ?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseWhitespace(" ", 5), parseQuotedString(`""`, 6), parseWhitespace(" ", 8), xml.QuestionMark(9), xml.RightAngleBracket(10)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 2))
                ]);
            nextTest(`<?xml?(>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.QuestionMark(5), parseUnrecognized("(", 6), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                    xml.Issues.expectedDeclarationRightAngleBracket(new qub.Span(6, 1))
                ]);
            nextTest(`<?xml?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.QuestionMark(5), xml.RightAngleBracket(6)])),
                [xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))]);
            nextTest(`<?xml?><?xml?>`,
                [
                    new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), xml.QuestionMark(5), xml.RightAngleBracket(6)])),
                    new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(7), xml.QuestionMark(8), parseName("xml", 9), xml.QuestionMark(12), xml.RightAngleBracket(13)]))
                ],
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(12, 1))
                ]);
            nextTest(`<?xml'?>`,
                new xml.Declaration(new qub.ArrayList([xml.LeftAngleBracket(0), xml.QuestionMark(1), parseName("xml", 2), parseQuotedString(`'?>`, 5)])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 3)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml a="" b="" c="" d="" ?>`,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`a=""`, 6),
                    parseWhitespace(" ", 10),
                    parseAttribute(`b=""`, 11),
                    parseWhitespace(" ", 15),
                    parseAttribute(`c=""`, 16),
                    parseWhitespace(" ", 20),
                    parseAttribute(`d=""`, 21),
                    parseWhitespace(" ", 25),
                    xml.QuestionMark(26),
                    xml.RightAngleBracket(27)
                ])),
                [
                    xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(6, 1)),
                    xml.Issues.expectedDeclarationEncodingOrStandaloneAttribute(new qub.Span(11, 1)),
                    xml.Issues.expectedDeclarationStandaloneAttribute(new qub.Span(16, 1)),
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(21, 4))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" standalone= `,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`version="1.0"`, 6),
                    parseWhitespace(" ", 19),
                    parseAttribute(`encoding="utf-8"`, 20),
                    parseWhitespace(" ", 36),
                    parseAttribute(`standalone= `, 37)
                ])),
                [
                    xml.Issues.missingAttributeValue(new qub.Span(37, 10)),
                    xml.Issues.missingDeclarationRightQuestionMark(new qub.Span(1, 1)),
                    xml.Issues.missingDeclarationRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" standalone= >`,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`version="1.0"`, 6),
                    parseWhitespace(" ", 19),
                    parseAttribute(`encoding="utf-8"`, 20),
                    parseWhitespace(" ", 36),
                    parseAttribute(`standalone= `, 37),
                    xml.RightAngleBracket(49)
                ])),
                [
                    xml.Issues.expectedAttributeValue(new qub.Span(49, 1)),
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(49, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" standalone="yes" >`,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`version="1.0"`, 6),
                    parseWhitespace(" ", 19),
                    parseAttribute(`encoding="utf-8"`, 20),
                    parseWhitespace(" ", 36),
                    parseAttribute(`standalone="yes"`, 37),
                    parseWhitespace(" ", 53),
                    xml.RightAngleBracket(54)
                ])),
                [
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(54, 1))
                ]);
            nextTest(`<?xml version="1.0" encoding="utf-8" standalone="yes" . >`,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`version="1.0"`, 6),
                    parseWhitespace(" ", 19),
                    parseAttribute(`encoding="utf-8"`, 20),
                    parseWhitespace(" ", 36),
                    parseAttribute(`standalone="yes"`, 37),
                    parseWhitespace(" ", 53),
                    xml.Period(54),
                    parseWhitespace(" ", 55),
                    xml.RightAngleBracket(56)
                ])),
                [
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(54, 1)),
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(56, 1))
                ]);
            nextTest(`<?xml version="" encoding="" standalone="" ?>`,
                new xml.Declaration(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.QuestionMark(1),
                    parseName("xml", 2),
                    parseWhitespace(" ", 5),
                    parseAttribute(`version=""`, 6),
                    parseWhitespace(" ", 16),
                    parseAttribute(`encoding=""`, 17),
                    parseWhitespace(" ", 28),
                    parseAttribute(`standalone=""`, 29),
                    parseWhitespace(" ", 42),
                    xml.QuestionMark(43),
                    xml.RightAngleBracket(44)
                ])),
                [
                    xml.Issues.invalidDeclarationVersionAttributeValue(new qub.Span(14, 2)),
                    xml.Issues.invalidDeclarationStandaloneAttributeValue(new qub.Span(40, 2))
                ]);
            nextTest(`<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`, new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace(" ", 5),
                parseAttribute(`version="1.0"`, 6),
                parseWhitespace(" ", 19),
                parseAttribute(`encoding="UTF-8"`, 20),
                parseWhitespace(" ", 36),
                parseAttribute(`standalone="no"`, 37),
                parseWhitespace(" ", 52),
                xml.QuestionMark(53),
                xml.RightAngleBracket(54)
            ])));
            nextTest(`<?xml version="1.0" encoding="utf-8" standalone="no" ?>`, new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace(" ", 5),
                parseAttribute(`version="1.0"`, 6),
                parseWhitespace(" ", 19),
                parseAttribute(`encoding="utf-8"`, 20),
                parseWhitespace(" ", 36),
                parseAttribute(`standalone="no"`, 37),
                parseWhitespace(" ", 52),
                xml.QuestionMark(53),
                xml.RightAngleBracket(54)
            ])));
            nextTest(`<?xml version="1.0" standalone="no" encoding="utf-8" ?>`, new xml.Declaration(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.QuestionMark(1),
                parseName("xml", 2),
                parseWhitespace(" ", 5),
                parseAttribute(`version="1.0"`, 6),
                parseWhitespace(" ", 19),
                parseAttribute(`standalone="no"`, 20),
                parseWhitespace(" ", 35),
                parseAttribute(`encoding="utf-8"`, 36),
                parseWhitespace(" ", 52),
                xml.QuestionMark(53),
                xml.RightAngleBracket(54)
            ])),
                [
                    xml.Issues.expectedDeclarationRightQuestionMark(new qub.Span(36, 16))
                ]);

            nextTest(`<!`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1)])),
                [
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<! `,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseWhitespace(" ", 2)])),
                [
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!>`, new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.RightAngleBracket(2)])));
            nextTest(`<! >`, new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseWhitespace(" ", 2), xml.RightAngleBracket(3)])));
            nextTest(`<!DOC`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOC", 2)])),
                [
                    xml.Issues.expectedDOCTYPENameCommentDashesOrCDATALeftSquareBracket(new qub.Span(2, 3)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!wat is this?`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("wat", 2), parseWhitespace(" ", 5), parseLetters("is", 6), parseWhitespace(" ", 8), parseLetters("this", 9), xml.QuestionMark(13)])),
                [
                    xml.Issues.expectedDOCTYPENameCommentDashesOrCDATALeftSquareBracket(new qub.Span(2, 3)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2)])),
                [
                    xml.Issues.missingDOCTYPERootElementName(new qub.Span(2, 7)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE `,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9)])),
                [
                    xml.Issues.missingDOCTYPERootElementName(new qub.Span(2, 7)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<! DOCTYPE`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseWhitespace(" ", 2), parseLetters("DOCTYPE", 3)])),
                [
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), xml.RightAngleBracket(9)])),
                [xml.Issues.expectedDOCTYPERootElementName(new qub.Span(9, 1))]);
            nextTest(`<!DOCTYPE >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), xml.RightAngleBracket(10)])),
                [xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 1))]);
            nextTest(`<! DOCTYPE>`, new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseWhitespace(" ", 2), parseLetters("DOCTYPE", 3), xml.RightAngleBracket(10)])));
            nextTest(`<!DOCTYPE 50`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseDigits("50", 10)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE 50>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseDigits("50", 10), xml.RightAngleBracket(12)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2))
                ]);
            nextTest(`<!DOCTYPE spam`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10)])),
                [
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam `,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14)])),
                [
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam>`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), xml.RightAngleBracket(14)])));
            nextTest(`<!DOCTYPE spam >`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), xml.RightAngleBracket(15)])));
            nextTest(`<!DOCTYPE spam PUBLIC`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15)])),
                [
                    xml.Issues.missingDOCTYPEPublicIdentifier(new qub.Span(15, 6)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC `,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21)])),
                [
                    xml.Issues.missingDOCTYPEPublicIdentifier(new qub.Span(15, 6)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), xml.RightAngleBracket(21)])),
                [
                    xml.Issues.expectedDOCTYPEPublicIdentifier(new qub.Span(21, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), xml.RightAngleBracket(22)])),
                [
                    xml.Issues.expectedDOCTYPEPublicIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15)])),
                [
                    xml.Issues.missingDOCTYPESystemIdentifier(new qub.Span(15, 6)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), xml.RightAngleBracket(22)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam OOPS >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("OOPS", 15), parseWhitespace(" ", 19), xml.RightAngleBracket(20)])),
                [
                    xml.Issues.invalidDOCTYPEExternalIdType(new qub.Span(15, 4))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC . >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), xml.Period(22), parseWhitespace(" ", 23), xml.RightAngleBracket(24)])),
                [
                    xml.Issues.expectedDOCTYPEPublicIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM . >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), xml.Period(22), parseWhitespace(" ", 23), xml.RightAngleBracket(24)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier'`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22)])),
                [
                    xml.Issues.missingDOCTYPESystemIdentifier(new qub.Span(22, 18)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier' "systemIdentifier"`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22), parseWhitespace(" ", 40), parseQuotedString(`"systemIdentifier"`, 41)])),
                [
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier' -`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22), parseWhitespace(" ", 40), xml.Dash(41)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(41, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier' [`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22), parseWhitespace(" ", 40), parseInternalDefinition("[", 41)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(41, 1)),
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(41, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier' [ `,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22), parseWhitespace(" ", 40), parseInternalDefinition("[ ", 41)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(41, 1)),
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(41, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'publicIdentifier' >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'publicIdentifier'`, 22), parseWhitespace(" ", 40), xml.RightAngleBracket(41)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(41, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'test' >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'test'`, 22), parseWhitespace(" ", 28), xml.RightAngleBracket(29)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(29, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC 'test' ) >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseQuotedString(`'test'`, 22), parseWhitespace(" ", 28), parseUnrecognized(")", 29), parseWhitespace(" ", 30), xml.RightAngleBracket(31)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(29, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM 'test' >`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), parseQuotedString(`'test'`, 22), parseWhitespace(" ", 28), xml.RightAngleBracket(29)])));
            nextTest(`<!DOCTYPE spam PUBLIC [] >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseInternalDefinition("[]", 22), parseWhitespace(" ", 24), xml.RightAngleBracket(25)])),
                [
                    xml.Issues.expectedDOCTYPEPublicIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM [] >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), parseInternalDefinition("[]", 22), parseWhitespace(" ", 24), xml.RightAngleBracket(25)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam PUBLIC [ ]>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("PUBLIC", 15), parseWhitespace(" ", 21), parseInternalDefinition("[ ]", 22), xml.RightAngleBracket(25)])),
                [
                    xml.Issues.expectedDOCTYPEPublicIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM [ ]>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), parseInternalDefinition("[ ]", 22), xml.RightAngleBracket(25)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(22, 1))
                ]);
            nextTest(`<!DOCTYPE spam SYSTEM [ ] wrong>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseLetters("SYSTEM", 15), parseWhitespace(" ", 21), parseInternalDefinition("[ ]", 22), parseWhitespace(" ", 25), parseLetters("wrong", 26), xml.RightAngleBracket(31)])),
                [
                    xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(22, 1)),
                    xml.Issues.expectedDOCTYPERightAngleBracket(new qub.Span(26, 5))
                ]);
            nextTest(`<!DOCTYPE spam . >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), xml.Period(15), parseWhitespace(" ", 16), xml.RightAngleBracket(17)])),
                [
                    xml.Issues.expectedDOCTYPEExternalIdTypeInternalDefinitionOrRightAngleBracket(new qub.Span(15, 1))
                ]);
            nextTest(`<!DOCTYPE spam [`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[", 15)])),
                [
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(15, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam [ `,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[ ", 15)])),
                [
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(15, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam [>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[>", 15)])),
                [
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(15, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam [ >`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[ >", 15)])),
                [
                    xml.Issues.missingInternalDefinitionRightSquareBracket(new qub.Span(15, 1)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE spam []>`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[]", 15), xml.RightAngleBracket(17)])));
            nextTest(`<!DOCTYPE spam [ ]>`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[ ]", 15), xml.RightAngleBracket(18)])));
            nextTest(`<!DOCTYPE spam [] >`, new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseName("spam", 10), parseWhitespace(" ", 14), parseInternalDefinition("[]", 15), parseWhitespace(" ", 17), xml.RightAngleBracket(18)])));
            nextTest(`<!DOCTYPE #>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseUnrecognized("#", 10), xml.RightAngleBracket(11)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 1))
                ]);
            nextTest(`<!DOCTYPE '>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseQuotedString(`'>`, 10)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE ''>`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseQuotedString(`''`, 10), xml.RightAngleBracket(12)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2))
                ]);
            nextTest(`<!DOCTYPE ">`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseQuotedString(`">`, 10)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2)),
                    xml.Issues.missingDOCTYPERightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!DOCTYPE "">`,
                new xml.DOCTYPE(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseName("DOCTYPE", 2), parseWhitespace(" ", 9), parseQuotedString(`""`, 10), xml.RightAngleBracket(12)])),
                [
                    xml.Issues.expectedDOCTYPERootElementName(new qub.Span(10, 2))
                ]);
            nextTest(`<!DOCTYPE note SYSTEM "Note.dtd">`, new xml.DOCTYPE(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                parseName("DOCTYPE", 2),
                parseWhitespace(" ", 9),
                parseName("note", 10),
                parseWhitespace(" ", 14),
                parseLetters("SYSTEM", 15),
                parseWhitespace(" ", 21),
                parseQuotedString(`"Note.dtd"`, 22),
                xml.RightAngleBracket(32)
            ])));

            nextTest(`<!-`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2)])),
                [
                    xml.Issues.missingCommentSecondStartDash(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!-i`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), parseLetters("i", 3)])),
                [
                    xml.Issues.expectedCommentSecondStartDash(new qub.Span(3, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!--`,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3)])),
                [
                    xml.Issues.missingCommentClosingDashes(new qub.Span(2, 2)),
                    xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!-- hello`,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), parseLetters("hello", 5)])),
                [
                    xml.Issues.missingCommentClosingDashes(new qub.Span(2, 2)),
                    xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!-- `,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4)])),
                [
                    xml.Issues.missingCommentClosingDashes(new qub.Span(2, 2)),
                    xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!-- -`,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5)])),
                [
                    xml.Issues.missingCommentSecondClosingDash(new qub.Span(5, 1)),
                    xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!-- --`,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5), xml.Dash(6)])),
                [xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))]);
            nextTest(`<!-- -->`, new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5), xml.Dash(6), xml.RightAngleBracket(7)])));
            nextTest(`<!-- --->`, new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5), xml.Dash(6), xml.Dash(7), xml.RightAngleBracket(8)])));
            nextTest(`<!-- ->-> `,
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5), xml.RightAngleBracket(6), xml.Dash(7), xml.RightAngleBracket(8), parseWhitespace(" ", 9)])),
                [
                    xml.Issues.missingCommentClosingDashes(new qub.Span(2, 2)),
                    xml.Issues.missingCommentRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`<!--<a>-->`, new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), xml.LeftAngleBracket(4), parseLetters("a", 5), xml.RightAngleBracket(6), xml.Dash(7), xml.Dash(8), xml.RightAngleBracket(9)])));
            nextTest(`<!-- ---><a>`, [
                new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), parseWhitespace(" ", 4), xml.Dash(5), xml.Dash(6), xml.Dash(7), xml.RightAngleBracket(8)])),
                new xml.StartTag(new qub.ArrayList([xml.LeftAngleBracket(9), parseName("a", 10), xml.RightAngleBracket(11)]))
            ]);
            nextTest(`<!-->-->`, new xml.Comment(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.Dash(2), xml.Dash(3), xml.RightAngleBracket(4), xml.Dash(5), xml.Dash(6), xml.RightAngleBracket(7)])));
            nextTest(`<!-- - -- > -> -->`, new xml.Comment(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.Dash(2),
                xml.Dash(3),
                parseWhitespace(" ", 4),
                xml.Dash(5),
                parseWhitespace(" ", 6),
                xml.Dash(7),
                xml.Dash(8),
                parseWhitespace(" ", 9),
                xml.RightAngleBracket(10),
                parseWhitespace(" ", 11),
                xml.Dash(12),
                xml.RightAngleBracket(13),
                parseWhitespace(" ", 14),
                xml.Dash(15),
                xml.Dash(16),
                xml.RightAngleBracket(17)
            ])));
            nextTest(`<!-- -->123`,
                [
                    new xml.Comment(new qub.ArrayList([
                        xml.LeftAngleBracket(0),
                        xml.ExclamationPoint(1),
                        xml.Dash(2),
                        xml.Dash(3),
                        parseWhitespace(" ", 4),
                        xml.Dash(5),
                        xml.Dash(6),
                        xml.RightAngleBracket(7)
                    ])),
                    parseText("123", 8)
                ]);

            nextTest("<![",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2)])),
                [
                    xml.Issues.missingCDATAName(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), xml.RightAngleBracket(3)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 1))
                ]);
            nextTest("<![ ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseWhitespace(" ", 3)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDAT",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDAT>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3), xml.RightAngleBracket(7)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4))
                ]);
            nextTest("<![CDAT ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3), parseWhitespace(" ", 7)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDAT >",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3), parseWhitespace(" ", 7), xml.RightAngleBracket(8)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4))
                ]);
            nextTest("<![CDAT[",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3), xml.LeftSquareBracket(7)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDAT ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDAT", 3), parseWhitespace(" ", 7)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 4)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![ CDATA",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseWhitespace(" ", 3), parseLetters("CDATA", 4)])),
                [
                    xml.Issues.expectedCDATAName(new qub.Span(3, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDATA", 3)])),
                [
                    xml.Issues.missingCDATASecondLeftSquareBracket(new qub.Span(2, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA ",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDATA", 3), parseWhitespace(" ", 8)])),
                [
                    xml.Issues.expectedCDATASecondLeftSquareBracket(new qub.Span(8, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA>",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDATA", 3), xml.RightAngleBracket(8)])),
                [
                    xml.Issues.expectedCDATASecondLeftSquareBracket(new qub.Span(8, 1))
                ]);
            nextTest("<![CDATA [",
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDATA", 3), parseWhitespace(" ", 8), xml.LeftSquareBracket(9)])),
                [
                    xml.Issues.expectedCDATASecondLeftSquareBracket(new qub.Span(8, 1)),
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[",
                new xml.CDATA(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), xml.LeftSquareBracket(2), parseName("CDATA", 3), xml.LeftSquareBracket(8)])),
                [
                    xml.Issues.missingCDATARightSquareBrackets(new qub.Span(8, 1)),
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[blah blah",
                new xml.CDATA(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.ExclamationPoint(1),
                    xml.LeftSquareBracket(2),
                    parseName("CDATA", 3),
                    xml.LeftSquareBracket(8),
                    parseLetters("blah", 9),
                    parseWhitespace(" ", 13),
                    parseLetters("blah", 14)
                ])),
                [
                    xml.Issues.missingCDATARightSquareBrackets(new qub.Span(8, 1)),
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[]",
                new xml.CDATA(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.ExclamationPoint(1),
                    xml.LeftSquareBracket(2),
                    parseName("CDATA", 3),
                    xml.LeftSquareBracket(8),
                    xml.RightSquareBracket(9)
                ])),
                [
                    xml.Issues.missingCDATASecondRightSquareBracket(new qub.Span(9, 1)),
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[50]",
                new xml.CDATA(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.ExclamationPoint(1),
                    xml.LeftSquareBracket(2),
                    parseName("CDATA", 3),
                    xml.LeftSquareBracket(8),
                    parseDigits("50", 9),
                    xml.RightSquareBracket(11)
                ])),
                [
                    xml.Issues.missingCDATASecondRightSquareBracket(new qub.Span(11, 1)),
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[]]",
                new xml.CDATA(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.ExclamationPoint(1),
                    xml.LeftSquareBracket(2),
                    parseName("CDATA", 3),
                    xml.LeftSquareBracket(8),
                    xml.RightSquareBracket(9),
                    xml.RightSquareBracket(10)
                ])),
                [
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[]]]]",
                new xml.CDATA(new qub.ArrayList([
                    xml.LeftAngleBracket(0),
                    xml.ExclamationPoint(1),
                    xml.LeftSquareBracket(2),
                    parseName("CDATA", 3),
                    xml.LeftSquareBracket(8),
                    xml.RightSquareBracket(9),
                    xml.RightSquareBracket(10),
                    xml.RightSquareBracket(11),
                    xml.RightSquareBracket(12)
                ])),
                [
                    xml.Issues.missingCDATARightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest("<![CDATA[]]]>", new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseName("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightSquareBracket(9),
                xml.RightSquareBracket(10),
                xml.RightSquareBracket(11),
                xml.RightAngleBracket(12)
            ])));
            nextTest("<![CDATA[]]>", new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseName("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightSquareBracket(9),
                xml.RightSquareBracket(10),
                xml.RightAngleBracket(11)
            ])));

            nextTest(`<![CDATA[>]>]]>`, new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseName("CDATA", 3),
                xml.LeftSquareBracket(8),
                xml.RightAngleBracket(9),
                xml.RightSquareBracket(10),
                xml.RightAngleBracket(11),
                xml.RightSquareBracket(12),
                xml.RightSquareBracket(13),
                xml.RightAngleBracket(14)
            ])));
            nextTest("<![CDATA[]]>  ",
                [
                    new xml.CDATA(new qub.ArrayList([
                        xml.LeftAngleBracket(0),
                        xml.ExclamationPoint(1),
                        xml.LeftSquareBracket(2),
                        parseName("CDATA", 3),
                        xml.LeftSquareBracket(8),
                        xml.RightSquareBracket(9),
                        xml.RightSquareBracket(10),
                        xml.RightAngleBracket(11)
                    ])),
                    new xml.Text(new qub.ArrayList([parseWhitespace("  ", 12)]))
                ]);
            nextTest("<![CDATA[]]]>  ",
                [
                    new xml.CDATA(new qub.ArrayList([
                        xml.LeftAngleBracket(0),
                        xml.ExclamationPoint(1),
                        xml.LeftSquareBracket(2),
                        parseName("CDATA", 3),
                        xml.LeftSquareBracket(8),
                        xml.RightSquareBracket(9),
                        xml.RightSquareBracket(10),
                        xml.RightSquareBracket(11),
                        xml.RightAngleBracket(12)
                    ])),
                    new xml.Text(new qub.ArrayList([parseWhitespace("  ", 13)]))
                ]);
            nextTest(`<![CDATA[ a[0].foo ]]>`, new xml.CDATA(new qub.ArrayList([
                xml.LeftAngleBracket(0),
                xml.ExclamationPoint(1),
                xml.LeftSquareBracket(2),
                parseName("CDATA", 3),
                xml.LeftSquareBracket(8),
                parseWhitespace(" ", 9),
                parseLetters("a", 10),
                xml.LeftSquareBracket(11),
                parseDigits("0", 12),
                xml.RightSquareBracket(13),
                xml.Period(14),
                parseLetters("foo", 15),
                parseWhitespace(" ", 18),
                xml.RightSquareBracket(19),
                xml.RightSquareBracket(20),
                xml.RightAngleBracket(21)
            ])));

            nextTest(`<!50`,
                new xml.UnrecognizedTag(new qub.ArrayList([xml.LeftAngleBracket(0), xml.ExclamationPoint(1), parseDigits("50", 2)])),
                [
                    xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
                ]);
            nextTest(`(`, parseText("(", 0));
            nextTest(`hello <there>`, [
                parseText(`hello `, 0),
                parseStartTag("<there>", 6)
            ]);
            nextTest(`hello there`, parseText(`hello there`, 0));
            nextTest(`hello\nthere\n`, [parseText(`hello`, 0), parseNewLine("\n", 5), parseText("there", 6), parseNewLine("\n", 11)]);
        });
    });

    suite("Element", () => {
        test(`with no segments`, () => {
            assert.throws(() => { new xml.Element(new qub.ArrayList<xml.Segment>()); });
        });

        function elementTest(text: string, expectedStartTag: xml.StartTag, expectedChildren: xml.Segment[], expectedEndTag: xml.EndTag, expectedFormattedText: string): void {
            test(`with ${qub.escapeAndQuote(text)}`, () => {
                const element: xml.Element = parseElement(text);
                assert.deepEqual(element.startIndex, 0);
                assert.deepEqual(element.getLength(), text.length);
                assert.deepEqual(element.afterEndIndex, text.length);
                assert.deepEqual(element.span, new qub.Span(0, text.length));

                assert.deepEqual(element.toString(), text, "Wrong toString()");
                const context = new xml.FormatContext();
                assert.deepEqual(element.format(context), expectedFormattedText, "Wrong format()");
                assert.deepEqual(context.currentColumnIndex, qub.getColumnIndex(expectedFormattedText, expectedFormattedText.length));

                for (let i = element.startIndex - 1; i <= element.afterEndIndex + 1; ++i) {
                    const expected: boolean = element.startIndex < i && (!element.endTag || !element.endTag.getRightAngleBracket() || i < element.endTag.afterEndIndex);
                    assert.deepEqual(element.containsIndex(i), expected, `${i} should ${!expected ? "not" : ""} have been contained by ${qub.escapeAndQuote(text)}`);
                }

                assert.deepEqual(element.startTag, expectedStartTag, "Wrong startTag");
                assert.deepEqual(element.attributes.toArray(), expectedStartTag.attributes.toArray());
                assert.deepEqual(element.getName(), expectedStartTag.getName(), "Wrong name");
                assert.deepEqual(element.children.toArray(), expectedChildren, "Wrong children");
                assert.deepEqual(element.endTag, expectedEndTag, "Wrong endTag");
            });
        }

        elementTest(`<a`, parseStartTag(`<a`), [], undefined, `<a`);
        elementTest(`<a `, parseStartTag(`<a `), [], undefined, "<a");
        elementTest(`<a\n`, parseStartTag(`<a\n`), [], undefined, "<a\n");
        elementTest(`<a b`, parseStartTag(`<a b`), [], undefined, `<a b`);
        elementTest(`<a   b`, parseStartTag(`<a   b`), [], undefined, `<a b`);
        elementTest(`<a\nb`, parseStartTag(`<a\nb`), [], undefined, `<a\n  b`);
        elementTest(`<a b=`, parseStartTag(`<a b=`), [], undefined, `<a b=`);
        elementTest(`<a b =`, parseStartTag(`<a b =`), [], undefined, `<a b=`);
        elementTest(`<a b\n=`, parseStartTag(`<a b\n=`), [], undefined, `<a b\n  =`);
        elementTest(`<a b='`, parseStartTag(`<a b='`), [], undefined, `<a b='`);
        elementTest(`<a b= '`, parseStartTag(`<a b= '`), [], undefined, `<a b='`);
        elementTest(`<a b=''`, parseStartTag(`<a b=''`), [], undefined, `<a b=''`);
        elementTest(`<a b= ''`, parseStartTag(`<a b= ''`), [], undefined, `<a b=''`);
        elementTest(`<a>`, parseStartTag(`<a>`), [], undefined, `<a>`);
        elementTest(`<a b="c">`, parseStartTag(`<a b="c">`), [], undefined, `<a b="c">`);
        elementTest(`<a b=" c ">`, parseStartTag(`<a b=" c ">`), [], undefined, `<a b=" c ">`);
        elementTest(`<a b="\nc\n">`, parseStartTag(`<a b="\nc\n">`), [], undefined, `<a b="\nc\n">`);
        elementTest(`<a b="c"\nd="e"\n>`, parseStartTag(`<a b="c"\nd="e"\n>`), [], undefined, `<a b="c"\n  d="e"\n  >`);
        elementTest(`<a>  `, parseStartTag("<a>"), [parseText("  ", 3)], undefined, `<a>`);
        elementTest(`<a>test`, parseStartTag("<a>"), [parseText("test", 3)], undefined, `<a>test`);
        elementTest(`<a>  test  `, parseStartTag("<a>"), [parseText("  test  ", 3)], undefined, `<a>test`);
        elementTest(`<a>test\n`, parseStartTag("<a>"), [parseText("test", 3), parseNewLine("\n", 7)], undefined, `<a>\n  test\n`);
        elementTest(`<a>test\nA`, parseStartTag("<a>"), [parseText("test", 3), parseNewLine("\n", 7), parseText("A", 8)], undefined, `<a>\n  test\n  A`);
        elementTest(`<a>  test  </`, parseStartTag("<a>"), [parseText("  test  ", 3)], parseEndTag("</", 11), `<a>test</`);
        elementTest(`<a>  test  </>`, parseStartTag("<a>"), [parseText("  test  ", 3)], parseEndTag("</>", 11), `<a>test</>`);
        elementTest(`<a>  test  </b>`, parseStartTag("<a>"), [parseText("  test  ", 3)], parseEndTag(`</b>`, 11), `<a>test</b>`);
        elementTest(`<a>  test  </a>`, parseStartTag("<a>"), [parseText("  test  ", 3)], parseEndTag(`</a>`, 11), `<a>test</a>`);
        elementTest(`<a>\ntest\n</a>`, parseStartTag("<a>"), [parseNewLine("\n", 3), parseText("test", 4), parseNewLine("\n", 8)], parseEndTag(`</a>`, 9), `<a>\n  test\n</a>`);
        elementTest(`<a>\n  test  \n</a>`, parseStartTag("<a>"), [parseNewLine("\n", 3), parseText("  test  ", 4), parseNewLine("\n", 12)], parseEndTag(`</a>`, 13), `<a>\n  test\n</a>`);
        elementTest(`<a>b\nc\nd\ne</a>`, parseStartTag("<a>"), [parseText("b", 3), parseNewLine("\n", 4), parseText("c", 5), parseNewLine("\n", 6), parseText("d", 7), parseNewLine("\n", 8), parseText("e", 9)], parseEndTag(`</a>`, 10), `<a>\n  b\n  c\n  d\n  e\n</a>`);
        elementTest(`<a>\n\n`, parseStartTag("<a>"), [parseNewLine("\n", 3), parseNewLine("\n", 4)], undefined, `<a>\n\n`);
        elementTest(`<a><b>`, parseStartTag("<a>", 0), [parseElement("<b>", 3)], undefined, "<a>\n  <b>");
        elementTest(`<a> <b>`, parseStartTag("<a>", 0), [parseText(" ", 3), parseElement("<b>", 4)], undefined, "<a>\n  <b>");
        elementTest(`<a>\n \n \n<b>`, parseStartTag("<a>", 0), [parseNewLine("\n", 3), parseText(" ", 4), parseNewLine("\n", 5), parseText(" ", 6), parseNewLine("\n", 7), parseElement("<b>", 8)], undefined, "<a>\n\n\n  <b>");
        elementTest(`<a><b/></a>`, parseStartTag(`<a>`), [parseEmptyElement(`<b/>`, 3)], parseEndTag(`</a>`, 7), `<a>\n  <b/>\n</a>`);
        elementTest(`<a><b/>c</a>`, parseStartTag(`<a>`), [parseEmptyElement(`<b/>`, 3), parseText("c", 7)], parseEndTag(`</a>`, 8), `<a>\n  <b/>\n  c\n</a>`);
        elementTest(`<a><b><c/></b></a>`, parseStartTag(`<a>`), [parseElement(`<b><c/></b>`, 3)], parseEndTag(`</a>`, 14), `<a>\n  <b>\n    <c/>\n  </b>\n</a>`);
        elementTest(`<a>\n<b>\n<c/>\n</b>\n</a>`, parseStartTag(`<a>`), [parseNewLine("\n", 3), parseElement(`<b>\n<c/>\n</b>`, 4), parseNewLine("\n", 17)], parseEndTag(`</a>`, 18), `<a>\n  <b>\n    <c/>\n  </b>\n</a>`);

        elementTest(`<a></a>`, parseStartTag(`<a>`), [], parseEndTag(`</a>`, 3), `<a/>`);
        elementTest(`<a> </a>`, parseStartTag(`<a>`), [parseText(" ", 3)], parseEndTag(`</a>`, 4), `<a/>`);
        elementTest(`<a>\n</a>`, parseStartTag(`<a>`), [parseNewLine("\n", 3)], parseEndTag(`</a>`, 4), `<a>\n</a>`);
        elementTest(`<a>\r\n</a>`, parseStartTag(`<a>`), [parseNewLine("\r\n", 3)], parseEndTag(`</a>`, 5), `<a>\r\n</a>`);
        elementTest(`<a></>`, parseStartTag(`<a>`), [], parseEndTag("</>", 3), `<a></>`);
        elementTest(`<a></b>`, parseStartTag(`<a>`), [], parseEndTag(`</b>`, 3), `<a></b>`);
        elementTest(`<a b='c'></a>`, parseStartTag(`<a b='c'>`), [], parseEndTag(`</a>`, 9), `<a b='c'/>`);
        elementTest(`<a b='c' ></a>`, parseStartTag(`<a b='c' >`), [], parseEndTag(`</a>`, 10), `<a b='c'/>`);
        elementTest(`<a></a b='c'>`, parseStartTag(`<a>`), [], parseEndTag(`</a b='c'>`, 3), `<a></a b='c'>`);
        elementTest(`<a b='c'></a d='e'>`, parseStartTag(`<a b='c'>`), [], parseEndTag(`</a d='e'>`, 9), `<a b='c'></a d='e'>`);

        elementTest(`<a>\n  b\n  <c/>`, parseStartTag("<a>"), [parseNewLine("\n", 3), parseText("  b", 4), parseNewLine("\n", 7), parseText("  ", 8), parseEmptyElement("<c/>", 10)], undefined, `<a>\n  b\n  <c/>`);
        elementTest(`<a>\n  b\n\n  <c/>`, parseStartTag("<a>"), [parseNewLine("\n", 3), parseText("  b", 4), parseNewLine("\n", 7), parseNewLine("\n", 8), parseText("  ", 9), parseEmptyElement("<c/>", 11)], undefined, `<a>\n  b\n\n  <c/>`);
    });

    suite("Prolog", () => {
        test(`with null segments`, () => {
            const prolog = new xml.Prolog(null);
            assert.deepEqual(prolog.declaration, undefined);
            assert.deepEqual(prolog.doctype, undefined);
        });

        test(`with undefined segments`, () => {
            const prolog = new xml.Prolog(undefined);
            assert.deepEqual(prolog.declaration, undefined);
            assert.deepEqual(prolog.doctype, undefined);
        });

        function prologTest(prologText: string, expectedDeclaration?: xml.Declaration, expectedDoctype?: xml.DOCTYPE): void {
            test(`with ${qub.escapeAndQuote(prologText)}`, () => {
                const prolog = new xml.Prolog(parseSegments(prologText));
                assert.deepEqual(prolog.declaration, expectedDeclaration);
                assert.deepEqual(prolog.doctype, expectedDoctype);
            });
        }

        prologTest(null);
        prologTest(undefined);
        prologTest("");
        prologTest(" ");
        prologTest("<?");
        prologTest(" <?");
        prologTest("<?xml?>", parseDeclaration("<?xml?>"));
        prologTest(" <?xml?> ", parseDeclaration("<?xml?>", 1));
        prologTest("<!DOCTYPE", undefined, parseDOCTYPE("<!DOCTYPE"));
        prologTest(" <!DOCTYPE", undefined, parseDOCTYPE("<!DOCTYPE", 1));
        prologTest("<!DOCTYPE>", undefined, parseDOCTYPE("<!DOCTYPE>"));
        prologTest(" <!DOCTYPE> ", undefined, parseDOCTYPE("<!DOCTYPE>", 1));
        prologTest("<?xml?><!DOCTYPE>", parseDeclaration("<?xml?>"), parseDOCTYPE("<!DOCTYPE>", 7));
        prologTest("<?xml?>\n<!DOCTYPE>", parseDeclaration("<?xml?>"), parseDOCTYPE("<!DOCTYPE>", 8));
        prologTest("<?xml?>\n<!DOCTYPE>\n<?pi a b ?>", parseDeclaration("<?xml?>"), parseDOCTYPE("<!DOCTYPE>", 8));
    });

    suite("Document", () => {
        function documentTest(documentSegments: xml.Segment[], expectedFormattedText: string = "", expectedProlog?: xml.Prolog, expectedElement?: xml.Element | xml.EmptyElement): void {
            test(`with ${qub.escapeAndQuote(documentSegments ? qub.getCombinedText(documentSegments) : documentSegments === null ? null : undefined)}`, () => {
                let documentSegmentsIterable: qub.Iterable<xml.Segment>;
                if (documentSegments) {
                    documentSegmentsIterable = new qub.ArrayList<xml.Segment>(documentSegments);
                }
                else if (documentSegments === null) {
                    documentSegmentsIterable = null;
                }

                const xmlDocument = new xml.Document(documentSegmentsIterable, new qub.ArrayList<qub.Issue>());

                assert.deepEqual(xmlDocument.segments ? xmlDocument.segments.toArray() : xmlDocument.segments, documentSegments);

                const expectedText: string = qub.getCombinedText(documentSegments);
                assert.deepEqual(xmlDocument.toString(), expectedText);
                assert.deepEqual(xmlDocument.getLength(), expectedText.length, "Wrong length.");

                const context = new xml.FormatContext();
                assert.deepEqual(xmlDocument.format(context), expectedFormattedText);
                assert.deepEqual(context.currentColumnIndex, qub.getColumnIndex(expectedFormattedText, expectedFormattedText.length));

                assert.deepEqual(xmlDocument.prolog, expectedProlog);
                assert.deepEqual(xmlDocument.declaration, expectedProlog ? expectedProlog.declaration : undefined);
                assert.deepEqual(xmlDocument.doctype, expectedProlog ? expectedProlog.doctype : undefined);

                assert.deepEqual(xmlDocument.root, expectedElement);
            });
        }

        documentTest(undefined);
        documentTest(null);
        documentTest([]);
        documentTest([parseElement(`<a></a>`)], "<a/>", undefined, parseElement(`<a></a>`));
        documentTest(
            [
                parseDeclaration("<?xml?>"),
                parseNewLine("\n", 7),
                parseDOCTYPE("<!DOCTYPE root>", 8),
                parseNewLine("\n", 23),
                parseEmptyElement("<root/>", 24)
            ],
            `<?xml?>\n<!DOCTYPE root>\n<root/>`,
            parseProlog(`<?xml?>\n<!DOCTYPE root>\n`),
            parseEmptyElement(`<root/>`, 24));
        documentTest([parseText("   "), parseEmptyElement("<a/>", 3)], "<a/>", parseProlog("   "), parseEmptyElement("<a/>", 3));
        documentTest(
            [
                parseDeclaration(`<?xml?>`, 0),
                parseNewLine("\n", 7),
                parseText(" ", 8),
                parseDOCTYPE("<!DOCTYPE>", 9),
                parseText(" ", 19),
                parseNewLine("\n", 20),
                parseEmptyElement("<a/>", 21)
            ],
            "<?xml?>\n<!DOCTYPE>\n<a/>",
            parseProlog("<?xml?>\n <!DOCTYPE> \n"),
            parseEmptyElement("<a/>", 21));
        documentTest(
            [
                parseEmptyElement("<a/>"),
                parseText("hello", 4),
                parseEmptyElement("<b/>", 9)
            ],
            "<a/>\nhello\n<b/>",
            undefined,
            parseEmptyElement("<a/>"));
        documentTest(
            [
                parseDeclaration(`<?xml?>`, 0),
                parseProcessingInstruction(`<?pi?>`, 7),
                parseEmptyElement("<a/>", 13)
            ],
            `<?xml?>\n<?pi?>\n<a/>`,
            parseProlog(`<?xml?><?pi?>`),
            parseEmptyElement(`<a/>`, 13)
        );

        function documentFormatTest(documentSegments: xml.Segment[], contextData: xml.FormatContextData, expectedFormattedText: string): void {
            test(`with ${qub.escapeAndQuote(documentSegments ? qub.getCombinedText(documentSegments) : documentSegments === null ? null : undefined)} and options ${JSON.stringify(contextData)}`, () => {
                let documentSegmentsIterable: qub.Iterable<xml.Segment>;
                if (documentSegments) {
                    documentSegmentsIterable = new qub.ArrayList<xml.Segment>(documentSegments);
                }
                else if (documentSegments === null) {
                    documentSegmentsIterable = null;
                }

                const xmlDocument = new xml.Document(documentSegmentsIterable, new qub.ArrayList<qub.Issue>());

                assert.deepEqual(xmlDocument.format(contextData), expectedFormattedText);
            });
        }

        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: false }, `<a b="c"\n  d="e"/>`);
        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: true }, `<a b="c"\n   d="e"/>`);
        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: false, singleIndent: "\t" }, `<a b="c"\n\td="e"/>`);
        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 2 }, `<a b="c"\n\t d="e"/>`);
        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 3 }, `<a b="c"\n\td="e"/>`);
        documentFormatTest([parseEmptyElement(`<a b="c"\nd="e"/>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 4 }, `<a b="c"\n   d="e"/>`);
        documentFormatTest([parseEmptyElement(`<sometag firstattr=""\nsecond="" />`)], { alignAttributes: true }, `<sometag firstattr=""\n         second="" />`);
        documentFormatTest([parseEmptyElement(`<sometag firstattr=""\nsecond="" />`)], { alignAttributes: true, singleIndent: "\t" }, `<sometag firstattr=""\n\t\t\t\t second="" />`);
        documentFormatTest([parseEmptyElement(`<sometag firstattr=""\nsecond="" />`)], { alignAttributes: true, singleIndent: "\t", tabLength: 3 }, `<sometag firstattr=""\n\t\t\tsecond="" />`);

        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: false }, `<a b="c"\n  d="e"/>`);
        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: true }, `<a b="c"\n   d="e"/>`);
        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: false, singleIndent: "\t" }, `<a b="c"\n\td="e"/>`);
        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 2 }, `<a b="c"\n\t d="e"/>`);
        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 3 }, `<a b="c"\n\td="e"/>`);
        documentFormatTest([parseElement(`<a b="c"\nd="e"></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 4 }, `<a b="c"\n   d="e"/>`);

        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: false }, `<a>\n  <b c="d"\n    e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: true }, `<a>\n  <b c="d"\n     e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: false, singleIndent: "\t" }, `<a>\n\t<b c="d"\n\t\te="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 2 }, `<a>\n\t<b c="d"\n\t\t e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 3 }, `<a>\n\t<b c="d"\n\t\te="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"/></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 4 }, `<a>\n\t<b c="d"\n\t   e="f"/>\n</a>`);

        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: false }, `<a>\n  <b c="d"\n    e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: true }, `<a>\n  <b c="d"\n     e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: false, singleIndent: "\t" }, `<a>\n\t<b c="d"\n\t\te="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: true, singleIndent: "\t" }, `<a>\n\t<b c="d"\n\t\t e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 2 }, `<a>\n\t<b c="d"\n\t\t e="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 3 }, `<a>\n\t<b c="d"\n\t\te="f"/>\n</a>`);
        documentFormatTest([parseElement(`<a><b c="d"\ne="f"></b></a>`)], { alignAttributes: true, singleIndent: "\t", tabLength: 4 }, `<a>\n\t<b c="d"\n\t   e="f"/>\n</a>`);
    });

    suite("parseElement()", () => {
        function parseElementTest(elementText: string, elementSegments: xml.Segment[] = [], expectedIssues: qub.Issue[] = []): void {
            test(`with ${qub.escapeAndQuote(elementText)}`, () => {
                const tokenizer = new xml.Tokenizer(elementText);
                assert.deepEqual(tokenizer.next(), true);
                assert(tokenizer.getCurrent() instanceof xml.StartTag);
                assert.deepEqual(xml.parseElement(tokenizer), new xml.Element(new qub.ArrayList(elementSegments)));
            });

            test(`with ${qub.escapeAndQuote(elementText)} with issues`, () => {
                const issues = new qub.ArrayList<qub.Issue>();
                const tokenizer = new xml.Tokenizer(elementText, 0, issues);
                assert.deepEqual(tokenizer.next(), true);
                assert(tokenizer.getCurrent() instanceof xml.StartTag);
                assert.deepEqual(xml.parseElement(tokenizer), new xml.Element(new qub.ArrayList(elementSegments)));
                assert.deepEqual(issues.toArray(), expectedIssues);
            });
        }

        parseElementTest(`<a`,
            [parseStartTag(`<a`)],
            [
                xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1)),
                xml.Issues.missingElementEndTag(new qub.Span(1, 1), "a")
            ]);
        parseElementTest(`<apples>`,
            [parseStartTag(`<apples>`)],
            [xml.Issues.missingElementEndTag(new qub.Span(1, 6), "apples")]);
        parseElementTest(`<apples></oranges>`,
            [parseStartTag(`<apples>`), parseEndTag("</oranges>", 8)],
            [xml.Issues.expectedElementEndTagWithDifferentName(new qub.Span(10, 7), "apples")]);
        parseElementTest(`<apples>and<bananas/></apples>`, [parseStartTag(`<apples>`), parseText("and", 8), parseEmptyElement(`<bananas/>`, 11), parseEndTag(`</apples>`, 21)]);
        parseElementTest(`<a><b><c/></b></a>`, [
            parseStartTag("<a>"),
            new xml.Element(new qub.ArrayList([
                parseStartTag("<b>", 3),
                parseEmptyElement("<c/>", 6),
                parseEndTag("</b>", 10)])),
            parseEndTag("</a>", 14)
        ]);
        parseElementTest(`<a><b><c></b></a>`,
            [
                parseStartTag("<a>"),
                new xml.Element(new qub.ArrayList([
                    parseStartTag("<b>", 3),
                    new xml.Element(new qub.ArrayList([
                        parseStartTag("<c>", 6),
                        parseEndTag("</b>", 9)
                    ])),
                    parseEndTag("</a>", 13)
                ]))
            ],
            [
                xml.Issues.expectedElementEndTagWithDifferentName(new qub.Span(11, 1), "c"),
                xml.Issues.expectedElementEndTagWithDifferentName(new qub.Span(15, 1), "b"),
                xml.Issues.missingElementEndTag(new qub.Span(1, 1), "a")
            ]);
    });

    suite("parse()", () => {
        function parseTest(documentText: string, expectedDocumentSegments: xml.Segment[], expectedIssues: qub.Issue[] = []): void {
            test(`with ${qub.escapeAndQuote(documentText)}`, () => {
                const document: xml.Document = xml.parse(documentText);
                const expectedDocument = new xml.Document(new qub.ArrayList<xml.Segment>(expectedDocumentSegments), new qub.ArrayList<qub.Issue>(expectedIssues));
                assert.deepEqual(document, expectedDocument);
                assert.deepEqual(document.segments.toArray(), expectedDocumentSegments);
                assert.deepEqual(document.issues.toArray(), expectedIssues);
            });
        }

        parseTest(null, [], [xml.Issues.missingDocumentRootElement()]);
        parseTest(undefined, [], [xml.Issues.missingDocumentRootElement()]);
        parseTest("", [], [xml.Issues.missingDocumentRootElement()]);
        parseTest("  ", [parseText("  ")]);
        parseTest("text",
            [parseText("text")],
            [xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(0, 4))]);
        parseTest("a\n b\n c \n",
            [parseText("a"), parseNewLine("\n", 1), parseText(" b", 2), parseNewLine("\n", 4), parseText(" c ", 5), parseNewLine("\n", 8)],
            [
                xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(0, 1)),
                xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(3, 1)),
                xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(6, 1))
            ]);
        parseTest(`<?xml?>`,
            [parseDeclaration(`<?xml?>`)],
            [xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))]);
        parseTest(`<?xml?><?xml?>`,
            [parseDeclaration(`<?xml?>`), parseDeclaration(`<?xml?>`, 7)],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(12, 1)),
                xml.Issues.documentCanHaveOneDeclaration(new qub.Span(7, 7))
            ]);
        parseTest(`<!DOCTYPE root>`,
            [parseDOCTYPE(`<!DOCTYPE root>`)],
            [xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 15))]);
        parseTest(`<!DOCTYPE root 'testfile.xml'>`,
            [parseDOCTYPE(`<!DOCTYPE root 'testfile.xml'>`)],
            [
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 30))
            ]);
        parseTest(`<!DOCTYPE root "testfile.xml">`,
            [parseDOCTYPE(`<!DOCTYPE root "testfile.xml">`)],
            [
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 30))
            ]);
        parseTest(`<!DOCTYPE root PUBLIC "testfile.xml">`,
            [parseDOCTYPE(`<!DOCTYPE root PUBLIC "testfile.xml">`)],
            [
                xml.Issues.expectedDOCTYPESystemIdentifier(new qub.Span(36, 1)),
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 37))
            ]);
        parseTest(`<!DOCTYPE root PUBLIC "systemIdentifier" "testfile.xml" 'No errors here'>`,
            [parseDOCTYPE(`<!DOCTYPE root PUBLIC "systemIdentifier" "testfile.xml" 'No errors here'>`)],
            [
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 73))
            ]);
        parseTest(`<!DOCTYPE root PUBLIC "systemIdentifier" "testfile.xml" "No errors here">`,
            [parseDOCTYPE(`<!DOCTYPE root PUBLIC "systemIdentifier" "testfile.xml" "No errors here">`)],
            [
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 73))
            ]);

        parseTest(`<hello`,
            [parseElement(`<hello`)],
            [
                xml.Issues.missingStartTagRightAngleBracket(new qub.Span(0, 1)),
                xml.Issues.missingElementEndTag(new qub.Span(1, 5), "hello")
            ]);
        parseTest(`<`,
            [parseUnrecognizedTag(`<`)],
            [
                xml.Issues.missingNameQuestionMarkExclamationPointOrForwardSlash(new qub.Span(0, 1)),
                xml.Issues.missingTagRightAngleBracket(new qub.Span(0, 1))
            ]);
        parseTest(`<a>`,
            [parseElement(`<a>`)],
            [xml.Issues.missingElementEndTag(new qub.Span(1, 1), "a")]);
        parseTest(`<a></a>`, [parseElement(`<a></a>`)]);
        parseTest(`<a></b>`,
            [parseElement(`<a></b>`)],
            [xml.Issues.expectedElementEndTagWithDifferentName(new qub.Span(5, 1), "a")]);
        parseTest(`<a><b>`,
            [parseElement(`<a><b>`)],
            [
                xml.Issues.missingElementEndTag(new qub.Span(4, 1), "b"),
                xml.Issues.missingElementEndTag(new qub.Span(1, 1), "a")
            ]);
        parseTest(`<a><?xml?></a>`,
            [parseElement(`<a><?xml?></a>`)],
            [xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(8, 1))]);
        parseTest(`<a><!DOCTYPE></a>`,
            [parseElement(`<a><!DOCTYPE></a>`)],
            [xml.Issues.expectedDOCTYPERootElementName(new qub.Span(12, 1))]);
        parseTest(`<a/>`, [parseEmptyElement(`<a/>`)]);
        parseTest(`</ >`,
            [parseEndTag(`</ >`)],
            [xml.Issues.expectedEndTagName(new qub.Span(2, 1))]);
        parseTest(`</a>`, [parseEndTag(`</a>`)]);
        parseTest(`</a>test`,
            [parseEndTag(`</a>`), parseText("test", 4)],
            [xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(4, 4))]);
        parseTest(`<![CDATA[blah blah blah]]>`,
            [parseCDATA(`<![CDATA[blah blah blah]]>`)],
            [xml.Issues.documentCannotHaveCDATAAtRootLevel(new qub.Span(0, 26))]);
        parseTest(`<!-- comment -->`, [parseComment(`<!-- comment -->`)]);
        parseTest(`<a><!-- comment -->`,
            [parseElement(`<a><!-- comment -->`)],
            [xml.Issues.missingElementEndTag(new qub.Span(1, 1), `a`)]);
        parseTest(`<a><!-- comment -->`,
            [new xml.Element(new qub.ArrayList([
                parseStartTag("<a>"),
                parseComment("<!-- comment -->", 3)
            ]))],
            [xml.Issues.missingElementEndTag(new qub.Span(1, 1), `a`)]);
        parseTest(`<a><!-- comment --></a>`,
            [new xml.Element(new qub.ArrayList([
                parseStartTag("<a>"),
                parseComment("<!-- comment -->", 3),
                parseEndTag("</a>", 19)
            ]))]);
        parseTest(`<a><b><!-- comment --></b></a>`,
            [new xml.Element(new qub.ArrayList([
                parseStartTag("<a>"),
                new xml.Element(new qub.ArrayList([
                    parseStartTag("<b>", 3),
                    parseComment("<!-- comment -->", 6),
                    parseEndTag("</b>", 22)
                ])),
                parseEndTag("</a>", 26)
            ]))]);
        parseTest(`<a><!-- A1 --><b><!-- B --></b><!-- A2 --></a>`,
            [new xml.Element(new qub.ArrayList([
                parseStartTag("<a>"),
                parseComment("<!-- A1 -->", 3),
                new xml.Element(new qub.ArrayList([
                    parseStartTag("<b>", 14),
                    parseComment("<!-- B -->", 17),
                    parseEndTag("</b>", 27)
                ])),
                parseComment("<!-- A2 -->", 31),
                parseEndTag("</a>", 42)
            ]))]);
        parseTest(`<a><!-- a's --><!-- A2 --></a>`,
            [new xml.Element(new qub.ArrayList([
                parseStartTag("<a>"),
                parseComment("<!-- a's -->", 3),
                parseComment("<!-- A2 -->", 15),
                parseEndTag("</a>", 26)
            ]))]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'>`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'></a>`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEndTag(`</a>`, 40)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?>\n<!DOCTYPE root>\n<root>\n  <child>\n    <grandchild/>\n  </child>\n</root>`,
            [
                parseDeclaration(`<?xml?>`),
                parseNewLine("\n", 7),
                parseDOCTYPE("<!DOCTYPE root>", 8),
                parseNewLine("\n", 23),
                parseElement("<root>\n  <child>\n    <grandchild/>\n  </child>\n</root>", 24)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?><a/>`,
            [
                parseDeclaration(`<?xml?>`),
                parseEmptyElement(`<a/>`, 7)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?>\n`,
            [
                parseDeclaration(`<?xml?>`),
                parseNewLine("\n", 7)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?>\ntest\n`,
            [
                parseDeclaration(`<?xml?>`),
                parseNewLine("\n", 7),
                parseText(`test`, 8),
                parseNewLine("\n", 12)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(8, 4))
            ]);
        parseTest(`<?xml?><!-- -->`,
            [
                parseDeclaration(`<?xml?>`),
                parseComment(`<!-- -->`, 7)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<!-- --><?xml?>`,
            [
                parseComment(`<!-- -->`),
                parseDeclaration(`<?xml?>`, 8)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(13, 1)),
                xml.Issues.documentDeclarationMustBeFirstSegment(new qub.Span(8, 7))
            ]);
        parseTest(`<!DOCTYPE root SYSTEM 'test.xml'><?xml?>`,
            [
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`),
                parseDeclaration(`<?xml?>`, 33)
            ],
            [
                xml.Issues.documentDOCTYPEMustBeAfterDeclaration(new qub.Span(0, 33)),
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(38, 1)),
                xml.Issues.documentDeclarationMustBeFirstSegment(new qub.Span(33, 7))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'><a/><!DOCTYPE root SYSTEM 'test.xml'>`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEmptyElement(`<a/>`, 40),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 44)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                xml.Issues.documentCanHaveOneDOCTYPE(new qub.Span(44, 33))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'><a/>\t`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEmptyElement(`<a/>`, 40),
                parseText("\t", 44)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'><a/>test`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEmptyElement(`<a/>`, 40),
                parseText("test", 44)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                xml.Issues.documentCannotHaveTextAtRootLevel(new qub.Span(44, 4))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'><a/><!-- -->`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEmptyElement(`<a/>`, 40),
                parseComment("<!-- -->", 44)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1))
            ]);
        parseTest(`<?xml?><!DOCTYPE root SYSTEM 'test.xml'><a/><a></a><b/>`,
            [
                parseDeclaration(`<?xml?>`),
                parseDOCTYPE(`<!DOCTYPE root SYSTEM 'test.xml'>`, 7),
                parseEmptyElement(`<a/>`, 40),
                parseElement(`<a></a>`, 44),
                parseEmptyElement("<b/>", 51)
            ],
            [
                xml.Issues.expectedDeclarationVersionAttribute(new qub.Span(5, 1)),
                xml.Issues.documentCanHaveOneRootElement(new qub.Span(44, 7)),
                xml.Issues.documentCanHaveOneRootElement(new qub.Span(51, 4))
            ]);
    });

    suite("AttributeSchema", () => {
        test("with required", () => {
            const schema = new xml.AttributeSchema({
                name: "Hello",
                notWith: "noWay",
                required: true,
                requiredIfNotDefined: "iGuess"
            });
            assert.deepStrictEqual(schema.name, "Hello");
            assert.deepStrictEqual(schema.notWith, "noWay");
            assert.deepStrictEqual(schema.required, true);
            assert.deepStrictEqual(schema.requiredIfNotDefined, "iGuess");
            assert.deepStrictEqual(schema.extraProperties, undefined);
        });

        test("with not required", () => {
            const schema = new xml.AttributeSchema({
                name: "there",
                notWith: "noWay2",
                extraProperties: {}
            });
            assert.deepStrictEqual(schema.name, "there");
            assert.deepStrictEqual(schema.notWith, "noWay2");
            assert.deepStrictEqual(schema.required, false);
            assert.deepStrictEqual(schema.requiredIfNotDefined, undefined);
            assert.deepStrictEqual(schema.extraProperties, {});
        });
    });

    suite("ChildElementSchema", () => {
        test("with required", () => {
            const schema = new xml.ChildElementSchema<string>({
                type: "t1",
                atMostOne: false,
                mustBeLast: true,
                required: true
            });
            assert.deepStrictEqual(schema.type, "t1");
            assert.deepStrictEqual(schema.atMostOne, false);
            assert.deepStrictEqual(schema.mustBeLast, true);
            assert.deepStrictEqual(schema.required, true);
        });

        test("with not required", () => {
            const schema = new xml.ChildElementSchema<string>({
                type: "t2",
                atMostOne: true
            });
            assert.deepStrictEqual(schema.type, "t2");
            assert.deepStrictEqual(schema.atMostOne, true);
            assert.deepStrictEqual(schema.mustBeLast, false);
            assert.deepStrictEqual(schema.required, false);
        });
    });

    suite("ElementSchema", () => {
        test("with required attributes", () => {
            const schema = new xml.ElementSchema<number>({
                name: "test",
                attributes: [
                    new xml.AttributeSchema({
                        name: "a1"
                    }),
                    new xml.AttributeSchema({
                        name: "a2",
                        required: true
                    })
                ],
                allowTextChildElements: true,
                extraProperties: {
                    a: "b"
                }
            });
            assert.deepStrictEqual(schema.name, "test");
            assert.deepStrictEqual(schema.matchesName(undefined), false);
            assert.deepStrictEqual(schema.matchesName(parseName("test")), true);
            assert.deepStrictEqual(schema.attributes.toArray(), [
                new xml.AttributeSchema({
                    name: "a1"
                }),
                new xml.AttributeSchema({
                    name: "a2",
                    required: true
                })
            ]);
            assert.deepStrictEqual(schema.attributeNames.toArray(), ["a1", "a2"]);
            assert.deepStrictEqual(schema.requiredAttributes.toArray(), [
                new xml.AttributeSchema({
                    name: "a2",
                    required: true
                })
            ]);
        });

        test("getAttributeSchema()", () => {
            const schema = new xml.ElementSchema<number>({
                name: "test",
                attributes: [
                    new xml.AttributeSchema({
                        name: "a1"
                    }),
                    new xml.AttributeSchema({
                        name: "a2",
                        required: true
                    })
                ],
                allowTextChildElements: true,
                extraProperties: {
                    a: "b"
                }
            });
            assert.deepStrictEqual(schema.getAttributeSchema(undefined), undefined);
            assert.deepStrictEqual(schema.getAttributeSchema(null), undefined);
            assert.deepStrictEqual(schema.getAttributeSchema(""), undefined);
            assert.deepStrictEqual(schema.getAttributeSchema("not me"), undefined);
            assert.deepStrictEqual(
                schema.getAttributeSchema("a1"),
                new xml.AttributeSchema({
                    name: "a1"
                }));
        });

        suite("allowAllAttributes", () => {
            test("with no allowAllAttributes defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.allowAllAttributes, false);
            });

            test("with false", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    allowAllAttributes: false
                });
                assert.deepStrictEqual(schema.allowAllAttributes, false);
            });

            test("with true", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    allowAllAttributes: true
                });
                assert.deepStrictEqual(schema.allowAllAttributes, true);
            });
        });

        suite("additionalChildElements", () => {
            test("with no additionalChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.additionalChildElements, undefined);
            });

            test("with additionalChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    additionalChildElements: new xml.ChildElementSchema<number>({
                        type: 3
                    })
                });
                assert.deepStrictEqual(schema.additionalChildElements, new xml.ChildElementSchema<number>({ type: 3 }));
            });
        });

        suite("childElements", () => {
            test("with no childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.childElements.toArray(), []);
            });

            test("with empty childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: []
                });
                assert.deepStrictEqual(schema.childElements.toArray(), []);
            });

            test("with childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1
                        })
                    ]
                });
                assert.deepStrictEqual(schema.childElements.toArray(), [
                    new xml.ChildElementSchema<number>({
                        type: 1
                    })
                ]);
            });
        });

        suite("requiredChildElements", () => {
            test("with no childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.requiredChildElements.toArray(), []);
            });

            test("with empty childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: []
                });
                assert.deepStrictEqual(schema.requiredChildElements.toArray(), []);
            });

            test("with no required childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1
                        })
                    ]
                });
                assert.deepStrictEqual(schema.requiredChildElements.toArray(), []);
            });

            test("with required childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1,
                            required: true
                        })
                    ]
                });
                assert.deepStrictEqual(schema.requiredChildElements.toArray(), [
                    new xml.ChildElementSchema<number>({
                        type: 1,
                        required: true
                    })
                ]);
            });
        });

        suite("mustBeLastChildElement", () => {
            test("with no childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.mustBeLastChildElement, undefined);
            });

            test("with empty childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: []
                });
                assert.deepStrictEqual(schema.mustBeLastChildElement, undefined);
            });

            test("with no mustBeLastChildElement defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1
                        })
                    ]
                });
                assert.deepStrictEqual(schema.mustBeLastChildElement, undefined);
            });

            test("with mustBeLastChildElement defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1,
                            mustBeLast: true
                        })
                    ]
                });
                assert.deepStrictEqual(
                    schema.mustBeLastChildElement,
                    new xml.ChildElementSchema<number>({
                        type: 1,
                        mustBeLast: true
                    }));
            });
        });

        suite("atMostOneChildElements", () => {
            test("with no childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.atMostOneChildElements.toArray(), []);
            });

            test("with empty childElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: []
                });
                assert.deepStrictEqual(schema.atMostOneChildElements.toArray(), []);
            });

            test("with no mustBeLastChildElement defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1
                        })
                    ]
                });
                assert.deepStrictEqual(schema.atMostOneChildElements.toArray(), []);
            });

            test("with mustBeLastChildElement defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    childElements: [
                        new xml.ChildElementSchema<number>({
                            type: 1,
                            atMostOne: true
                        })
                    ]
                });
                assert.deepStrictEqual(schema.atMostOneChildElements.toArray(), [
                    new xml.ChildElementSchema<number>({
                        type: 1,
                        atMostOne: true
                    })
                ]);
            });
        });

        suite("dontValidateChildElements", () => {
            test("with no dontValidateChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.dontValidateChildElements, false);
            });

            test("with false dontValidateChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    dontValidateChildElements: false
                });
                assert.deepStrictEqual(schema.dontValidateChildElements, false);
            });

            test("with true dontValidateChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    dontValidateChildElements: true
                });
                assert.deepStrictEqual(schema.dontValidateChildElements, true);
            });
        });

        suite("allowTextChildElements", () => {
            test("with no allowTextChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.allowTextChildElements, false);
            });

            test("with false allowTextChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    allowTextChildElements: false
                });
                assert.deepStrictEqual(schema.allowTextChildElements, false);
            });

            test("with true allowTextChildElements defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    allowTextChildElements: true
                });
                assert.deepStrictEqual(schema.allowTextChildElements, true);
            });
        });

        suite("extraProperties", () => {
            test("with no extraProperties defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test"
                });
                assert.deepStrictEqual(schema.extraProperties, undefined);
            });

            test("with undefined extraProperties defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    extraProperties: undefined
                });
                assert.deepStrictEqual(schema.extraProperties, undefined);
            });

            test("with null extraProperties defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    extraProperties: null
                });
                assert.deepStrictEqual(schema.extraProperties, null);
            });

            test("with extraProperties defined", () => {
                const schema = new xml.ElementSchema<number>({
                    name: "test",
                    extraProperties: {
                        test: true
                    }
                });
                assert.deepStrictEqual(schema.extraProperties, { test: true });
            });
        });
    });
});