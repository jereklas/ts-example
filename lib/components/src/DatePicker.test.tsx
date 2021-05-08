import DatePicker from "./DatePicker";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DatePicker Tests", () => {
  const props = {
    date: undefined as Date | undefined,
    componentProps: {
      CalendarPopoverProps: {
        transitionDuration: 0,
      },
    },
  };

  const renderComponent = () => {
    render(<DatePicker {...props} />);
  };

  describe("when rendered without any props", () => {
    beforeEach(() => {
      renderComponent();
    });

    it("should display today's date", () => {
      const today = new Date().toLocaleString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      expect(screen.getByRole("textbox").getAttribute("value")).toBe(today);
    });

    describe("when calendar button is clicked", () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole("button"));
      });

      it("should render a calendar", () => {
        expect(screen.getByRole("region", { name: "Calendar" })).toBeDefined();
      });

      it("should render calendar controls", () => {
        expect(screen.getByRole("region", { name: "Calendar Controls" })).toBeDefined();
      });
    });
  });

  describe("when rendered with initial date of 6/11/2020, and calendar is open", () => {
    beforeEach(() => {
      props.date = new Date("6/11/2020");
      renderComponent();
      userEvent.click(screen.getByRole("button"));
    });

    it.each`
      key             | focused
      ${"ArrowUp"}    | ${"4"}
      ${"ArrowDown"}  | ${"18"}
      ${"ArrowRight"} | ${"12"}
      ${"ArrowLeft"}  | ${"10"}
    `("should change focus to button $focused on $key key press", ({ key, focused }) => {
      const btn11 = screen.getByRole("button", { name: "11" });
      fireEvent.keyDown(btn11, { key });
      expect(document?.activeElement).toHaveTextContent(focused);
    });
  });

  describe("when rendered with intial date of 1/1/2021", () => {
    beforeEach(() => {
      props.date = new Date("1/1/2021");
      renderComponent();
    });

    it("should display the date supplied", () => {
      expect(screen.getByRole("textbox").getAttribute("value")).toBe("01/01/2021");
    });

    describe("when calendar is opened", () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole("button"));
      });

      it.each`
        clicks | label               | days
        ${1}   | ${"February 2021"}  | ${28}
        ${2}   | ${"March 2021"}     | ${31}
        ${3}   | ${"April 2021"}     | ${30}
        ${4}   | ${"May 2021"}       | ${31}
        ${5}   | ${"June 2021"}      | ${30}
        ${6}   | ${"July 2021"}      | ${31}
        ${7}   | ${"August 2021"}    | ${31}
        ${8}   | ${"September 2021"} | ${30}
        ${9}   | ${"October 2021"}   | ${31}
        ${10}  | ${"November 2021"}  | ${30}
        ${11}  | ${"December 2021"}  | ${31}
        ${12}  | ${"January 2022"}   | ${31}
      `(
        "should display '$month $year' after clicking the next month button $clicks times",
        ({ clicks, label, days }) => {
          for (let i = 0; i < clicks; i += 1) {
            userEvent.click(screen.getByRole("button", { name: "Next Month" }));
          }
          expect(screen.getByText(label)).toBeDefined();
          expect(screen.getByRole("button", { name: `${days}` })).toBeDefined();
          expect(screen.queryByRole("button", { name: `${days + 1}` })).toBe(null);
        }
      );

      it("should go to back to december of last year on prev month click", () => {
        userEvent.click(screen.getByRole("button", { name: "Previous Month" }));
        expect(screen.getByText("December 2020")).toBeDefined();
      });

      describe("when changed to February on a leap year", () => {
        beforeEach(async () => {
          // scrollIntoView doesn't exist during test, so we need to mock it
          const scrollIntoViewMock = jest.fn();
          Element.prototype.scrollIntoView = scrollIntoViewMock;
          userEvent.click(screen.getByRole("button", { name: "Month Year Dropdown" }));
          await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalled());
          userEvent.click(screen.getByRole("button", { name: "February" }));
          userEvent.click(screen.getByRole("button", { name: "2020" }));
        });

        it("should have 29 days", () => {
          expect(screen.getByRole("button", { name: "29" })).toBeDefined();
          expect(screen.queryByRole("button", { name: "30" })).toBe(null);
        });

        describe("when leap day is selected", () => {
          beforeEach(() => {
            userEvent.click(screen.getByRole("button", { name: "29" }));
          });

          it("should display 02/29/2020 in the textbox", () => {
            expect(screen.getByRole("textbox").getAttribute("value")).toBe("02/29/2020");
          });
        });
      });
    });
  });
});
