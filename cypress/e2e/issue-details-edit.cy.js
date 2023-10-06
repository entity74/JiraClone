describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it.only("Checking the “Priority” dropdown ", () => {
    const expectedLength = 5; // predefine amount of "Priorities"
    let priorityArray = []; // predefine empty array where we will store all Found priority Names

    // next funcion is to save predefined Priority name which is automatically shown when we open the ticket to array that we predefined
    getTextOfHTMLElementAndSaveToArray(
      'div[data-testid="select:priority"]>div>div', // HTML element
      "0", // number of the element, if there will be found more than 1 in the DOM (same as .eq() in chaining )
      priorityArray // array where we will store all Found priority Names
    );

    cy.get('div[data-testid="select:priority"]>div>div').click(); // click on element under Priority word
    cy.get("div[data-select-option-value]") // find all Priority elements with values in the Priority pop-up modal
      .its("length") // get amount of elements
      .should("eq", expectedLength - 1) // verify amount of found elements is equal 5-1 (because after opening the dropdown, predefined Property is no longer shown and is already stored in our predefined array)
      .then((value) => {
        for (let i = 0; i <= value - 1; i++) {
          // for each element found (4), we execute function getTextOfHTMLElementAndSaveToArray and provide HTML element, element number(from 0 to 3 because .eq() useses 0 as starting point,
          //  in total there will be 4 elements: 0,1,2,3 ) and array (predefined array)
          getTextOfHTMLElementAndSaveToArray(
            "div[data-select-option-value]",
            i,
            priorityArray
          );
        }
      })
      .then(() => {
        expect(priorityArray.length).to.equal(expectedLength); // after all Priority Names are saved to predefined array, we assert that our modified predefined array lenght is equal to expectedLenght value
      });
  });

  it.only("Checking the Reporter name contains only chars ", () => {
    cy.get("div[data-testid='select:reporter']> div>div:nth-child(2)") // get element with Reporter name
      .invoke("text") // get property text of found HTML element
      .should("be.a", "string") // extra verification (better visuals in Cypress UI)
      .then((value) => {
        // take value which is returned after .invoke('text') (in our case it is Reporter name : Baby Yoda)
        let nameCharactersArray = []; // create empty array where we will store each character of obtained name (Baby Yoda)
        nameCharactersArray = value.split(""); //  value.split function will take each character of value (Baby Yoda) and store into our array
        for (
          let i = 0;
          i <= nameCharactersArray.length - 1;
          i++ // set loop (actions within next {} ) to run equal to our array.length-1 times ( -1 because array character index starts always with 0 ,e.g. nameCharactersArray[0] = 'B',nameCharactersArray[1] = 'a', etc')
        ) {
          expect(nameCharactersArray[i]).to.match(/^[A-Za-z\s]$/); // take element of array and compare to regex
        }
      });
  });

  function getTextOfHTMLElementAndSaveToArray(
    htmlElement, // HTML element
    elementNumber, // number of the element if there will be found more than 1 in the DOM (same as .eq() in chaining )
    priorityArray // array where we will store all Found priority Names
  ) {
    cy.get(htmlElement)
      .eq(elementNumber)
      .invoke("text") // get property text of found HTML element
      .should("be.a", "string") // extra verification (better visuals in Cypress UI)
      .then(($value) => {
        // must use .then to save text value ($value) defined after .invoke to priority array
        priorityArray.push($value); // save the value of element to our predefined array
        cy.log("Added to Array value: " + $value);
        cy.log(
          "Latest added to Array value: " +
            priorityArray[priorityArray.length - 1]
        );
        cy.log("Array length: " + priorityArray.length);
      });
  }

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
