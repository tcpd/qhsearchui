import React, { Component } from "react";
import Popup from "./Shared/Popup.js";
import Checkbox from "./Shared/Checkbox.js";
import extend from "lodash/extend";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import ShowMore from "react-show-more";
import { CSVLink } from "react-csv";
import { Button } from "react-bootstrap";
// import * as moment from "moment";
// import { DateRangeFilter, DateRangeCalendar } from "searchkit-datefilter";

import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  RefinementListFilter,
  HierarchicalMenuFilter,
  HitsStats,
  HitItemProps,
  SortingSelector,
  NoHits,
  ResetFilters,
  RangeFilter,
  NumericRefinementListFilter,
  ViewSwitcherHits,
  ViewSwitcherToggle,
  DynamicRangeFilter,
  InputFilter,
  GroupedSelectedFilters,
  Layout,
  TopBar,
  InitialLoader,
  LayoutBody,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  SideBar,
  SearchkitComponent,
  Pagination,
  ItemHistogramList,
} from "searchkit";
// import "./index.css";

// const ES_HOST = process.env.ES_HOST || "localhost";
// const ES_PORT = process.env.ES_PORT || 9300;
const host = "http://localhost:9300/questions3";
const searchkit = new SearchkitManager(host);

fetch("http://localhost:9300/questions3/_search?size=2")
  .then((response) => response.json())
  .then((jsonData) => {
    // jsonData is parsed json object received from url
    console.log(jsonData.hits.hits);
  })
  .catch((error) => {
    // handle your errors here
    console.error(error);
  });

searchkit.translateFunction = (key) => {
  return {
    "pagination.next": "Next Page",
    "pagination.previous": "Previous Page",
  }[key];
};

console.log(searchkit.query);
var filename = "TCPD_QH.csv";
console.log("found searchkit results");

class GetQuestionsTable extends React.Component {
  render() {
    const { hits } = this.props;
    return (
      <div
        style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
        class="sk-item-list-option__text"
      >
        <table
          className="sk-table sk-table-striped"
          style={{
            boxSizing: "border-box",
          }}
        >
          <tbody
            style={{ display: "block", width: "1100px", overflow: "auto" }}
          >
            <thead>
              <td style={{ width: "150px" }}>
                <b>Date</b>
              </td>
              <td style={{ width: "120px" }}>
                <b>Ministry</b>
              </td>
              <td style={{ width: "120px" }}>
                <b>Subject</b>
              </td>
              <td style={{ width: "300px" }}>
                <b>Question</b>
              </td>
              <td style={{ width: "300px" }}>
                <b>Answer</b>
              </td>
              <td>
                <b>Link</b>
              </td>
              <td>
                <b>Member</b>
              </td>
            </thead>

            {hits.map((hit) => (
              <tr key={hit._id}>
                <td>{hit._source.date_str}</td>
                <td>{hit._source.ministry}</td>
                <td>{hit._source.subject}</td>
                <td>
                  <ShowMore lines={3} more=">" less="<">
                    {hit._source.Question}
                  </ShowMore>
                </td>
                <td>
                  <ShowMore lines={2} more=">" less="<">
                    {hit._source.clean_answers}
                  </ShowMore>
                </td>
                <td>
                  <a href={hit._source.Q_Link}>{"Link"}</a>
                </td>
                <td>
                  {hit._source.member
                    .toString()
                    .split(",")
                    .map((item, i) => {
                      return <p key={i}>{item}</p>;
                    })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const MovieHitsListItem = (props) => {
  const { bemBlocks, result } = props;
  let splitname = result._source.member;
  var split_names = splitname
    .toString()
    .replace("[", "")
    .split(",")
    .map((item, i) => {
      return <p key={i}>{item}</p>;
    });

  let splitparty = result._source.party;
  var split_party = splitparty
    .toString()
    .split(",")
    .map((item, i) => {
      return <p key={i}>{item}</p>;
    });

  let splitctype = result._source.constituency_type;
  var split_ctype = splitctype
    .toString()
    .split(",")
    .map((item, i) => {
      return <p key={i}>{item}</p>;
    });

  const source = extend({}, result._source, result.highlight);
  return (
    <tr
      data-qa="hit"
      className={bemBlocks.item().mix(bemBlocks.container("item"))}
    >
      <td>
        <h3 className={bemBlocks.item("subtitle")}>{source.ls_no}</h3>
      </td>
      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>
          {source.starred_unstarred}
        </h3>
      </td>

      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>{split_names}</h3>
      </td>

      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>{split_party}</h3>
      </td>

      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>
          <div
            className={bemBlocks.item("text")}
            dangerouslySetInnerHTML={{ __html: source.ministry }}
          ></div>
        </h3>
      </td>
      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>
          <div
            className={bemBlocks.item("text")}
            dangerouslySetInnerHTML={{ __html: source.date }}
          ></div>
        </h3>
      </td>
      <td style={{ width: "150px" }}>
        <h3 className={bemBlocks.item("subtitle")}>{split_ctype}</h3>
      </td>

      <td style={{ width: "250px" }}>
        <h3 className={bemBlocks.item("subtitle")}>
          <ShowMore lines={3} more=">" less="<">
            <div
              className={bemBlocks.item("text")}
              dangerouslySetInnerHTML={{ __html: source.Question }}
            ></div>
          </ShowMore>
        </h3>
      </td>
    </tr>
  );
};

// to display the hitstats correctly: '139 results found in 27ms'
export class FormattedHitsStats extends HitsStats {
  render() {
    var timeTaken = this.searchkit.getTime();
    var hitsCount = this.searchkit.getHitsCount();
    var checkdata = hitsCount;
    if (checkdata >= 10000) {
      checkdata = "More than 10,000";
    }

    var props = {
      bemBlocks: this.bemBlocks,
      translate: this.translate,
      timeTaken: timeTaken,
      hitsCount: hitsCount,
      resultsFoundLabel: this.translate("hitstats.results_found", {
        timeTaken: timeTaken,
        hitCount: checkdata.toLocaleString(),
      }),
    };
    return React.createElement(this.props.component, props);
  }
}

export default class BrowseData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditionsPopup: false,
      csvData: [],
      isDataDownloadable: false,
      change: 0,
    };
  }

  async getAllData(query) {
    const elasticsearch = require("elasticsearch");
    console.log("ping elasticsearch");
    const elasticSearchClient = new elasticsearch.Client({
      host: "http://localhost:9300/",
    });

    const result = await elasticSearchClient.search({
      index: "questions3",
      scroll: "2m",
      size: 10000,
      body: query.query,
    });

    const retriever = async ({ data, total, scrollId }) => {
      if (data.length >= total) {
        console.log("Condition is true");
        return data;
      }

      const result = await elasticSearchClient.scroll({
        scroll: "1m",
        scroll_id: scrollId,
      });
      data = [...data, ...result.hits.hits];
      return retriever({
        total,
        scrollId: result._scroll_id,
        data,
      });
    };
    console.log("This is result here");
    console.log(result.hits.hits);
    console.log(result);
    console.log("End of result here");

    const final_data = retriever({
      total: result.hits.total,
      scrollId: result._scroll_id,
      data: result.hits.hits,
    });

    console.log(final_data);
    var for_data = [];
    final_data
      .then(function (result) {
        for_data.push([
          "id",
          "ls_number",
          "ministry",
          "question_type",
          "question_text",
          "answer_text",
          "member",
          "party",
          "state",
          "constituency",
          "constituency_type",
          "gender",
        ]);
        for (var d = 0; d < result.length; d++) {
          for_data.push([
            result[d]._source.ID,
            result[d]._source.ls_no,
            result[d]._source.ministry,
            result[d]._source.starred_unstarred,
            result[d]._source.Question,
            result[d]._source.clean_answers,
            result[d]._source.member,
            result[d]._source.party,
            result[d]._source.state,
            result[d]._source.constituency,
            result[d]._source.constituency_type,
            result[d]._source.gender,
            // console.log(result[d]._source.party),
          ]);
        }
        console.log("new data populated");
      })
      .then(() => {
        this.setState({ csvData: for_data });
        this.setState({ change: this.state.change + 1 });
        console.log("data mapped to csvData");
      });
  }

  showTermsAndConditionsPopup = () => {
    this.setState({ showTermsAndConditionsPopup: true });
  };

  CloseTermsAndConditionsPopup = () => {
    this.setState({ showTermsAndConditionsPopup: false });
    this.setState({ isDataDownloadable: false });
  };

  CancelTermsAndConditionsPopup = () => {
    this.setState({ isDataDownloadable: false });
    this.setState({ showTermsAndConditionsPopup: false });
  };

  onAcceptTermsAndConditions = (key, checked) => {
    this.setState({ isDataDownloadable: checked });
    if (checked) {
      this.getAllData(searchkit.query);
      console.log("fetching data now");
    }
  };
  render() {
    var csvData = this.state.csvData;
    var change = this.state.change;
    var showTermsAndConditionsPopup = this.state.showTermsAndConditionsPopup;
    var isDataDownloadable = this.state.isDataDownloadable;
    const modalBody = (
      <div class="sk-item-list-option__text">
        <p>
          Parliamentary Questions portal is an online web interface provided by
          the Trivedi Centre for Political Data. In these terms of use of the
          data provided by the Centre, 'Data' includes all texts and
          compilations of data and other material presented within the
          application. The users are free to download, display or include the
          data in other products for non-commercial purposes at no cost subject
          to the following limitations:
        </p>
        <ul>
          <li>
            The user must include the citation for data they use. The user must
            not claim or imply that the Trivedi Centre for Political Data
            endorses the user's use of the data or use of the Centre's logo(s)
            or trademarks(s) in conjunction with the same.
          </li>
          <li>
            The Centre makes no warranties with respect to the data and the user
            must agree that the Centre shall not be held responsible or liable
            to the user for any errors, omissions, misstatements and/or
            misrepresentations of the data though the user is encouraged to
            report the same to us (following the procedure elaborated upon
            within the 'Contact us' tab).
          </li>
          <li>
            The Centre may record visits to the application without collecting
            the personal information of the users. The records shall be used for
            statistical reports only.
          </li>
          <li>
            The user must agree that the use of data presented within the
            application can be seen as the acknowledgement of unconditionally
            accepting the Terms of Use presented by the Centre.
          </li>
        </ul>

        <Checkbox
          id={"dd_accept_condition"}
          label={
            <div class="sk-item-list-option__text">
              {" "}
              I accept the terms and conditions mentioned here.{" "}
            </div>
          }
          checked={this.state.isDataDownloadable}
          onChange={this.onAcceptTermsAndConditions}
        />
      </div>
    );
    var buttonClass = isDataDownloadable ? "btn-lg" : "btn-lg disabled";
    const modalFooter = (
      <div>
        <Button
          className="btn-lg"
          variant="primary"
          onClick={this.CancelTermsAndConditionsPopup}
        >
          Cancel
        </Button>
        <CSVLink className={buttonClass} data={csvData} filename={filename}>
          <Button
            className={buttonClass}
            variant="primary"
            onClick={this.CloseTermsAndConditionsPopup}
          >
            Download
            {/* {change} */}
          </Button>
        </CSVLink>
      </div>
    );
    return (
      //   <div className="content overflow-auto">
      <div className="browse-data">
        {/* <div className="row"> */}
        {/* <h2>Browse Data Page</h2> */}
        <SearchkitProvider searchkit={searchkit}>
          <Layout size="l">
            <TopBar>
              <div className="my-logo">
                Lok Sabha Parliamentary Questions (1999 - 2019)
              </div>
              <SearchBox
                autofocus={true}
                searchOnChange={true}
                prefixQueryFields={["Question^10"]}
                //   "starred_unstarred^2",
                //   "member",
                //   "ministry^10",
              />
            </TopBar>

            <LayoutBody>
              <SideBar>
                <HierarchicalMenuFilter
                  fields={["ls_no", "year"]}
                  title="Lok Sabha Term"
                  id="ls_no"
                  orderKey="_term"
                />

                <HierarchicalMenuFilter
                  fields={["starred_unstarred"]}
                  title="Question Type"
                  id="starred_unstarred"
                />

                <RefinementListFilter
                  field="ministry"
                  title="Ministry"
                  id="ministry"
                  size={5}
                  operator="OR"
                />

                <RefinementListFilter
                  field="gender"
                  title="MP's Gender"
                  id="gender"
                  operator="OR"
                />

                <RefinementListFilter
                  field="constituency_type"
                  title="MP's Constituency Type"
                  id="constituency_type"
                  operator="OR"
                />

                <RefinementListFilter
                  id="party"
                  title="MP's Party"
                  field="party"
                  size={5}
                  operator="OR"
                />

                <RefinementListFilter
                  id="member"
                  title="MP's Name"
                  field="member"
                  size={5}
                  operator="OR"
                />

                <HierarchicalMenuFilter
                  fields={["state", "constituency"]}
                  title="MP's State and Constituency "
                  id="constituency"
                />
                {/* <RefinementListFilter
                  id="state"
                  title="State"
                  field="state"
                  operator="AND"
                  listComponent={ItemHistogramList}
                  size={10}
                /> */}
              </SideBar>

              <LayoutResults>
                <ActionBar>
                  <ActionBarRow>
                    <HitsStats component={FormattedHitsStats} />
                  </ActionBarRow>

                  <ActionBarRow>
                    <GroupedSelectedFilters />
                    <ResetFilters />

                    <div>
                      <Button
                        // className="btn-lg"
                        size="lg"
                        variant="primary"
                        onClick={this.showTermsAndConditionsPopup}
                      >
                        {" "}
                        Download Data
                      </Button>
                      {showTermsAndConditionsPopup && (
                        <Popup
                          id="tems_and_conditions_popup"
                          show={showTermsAndConditionsPopup}
                          body={modalBody}
                          heading={<p>Terms and Conditions</p>}
                          footer={modalFooter}
                          handleClose={this.CloseTermsAndConditionsPopup}
                        />
                      )}
                    </div>
                  </ActionBarRow>
                </ActionBar>
                <ViewSwitcherHits
                  hitsPerPage={30}
                  highlightFields={["member", "ministry", "Question"]}
                  sourceFilter={[
                    "ls_no",
                    "Question",
                    "starred_unstarred",
                    "member",
                    "gender",
                    "party",
                    "ministry",
                    "date",
                    "date_str",
                    "state",
                    "ID",
                    "subject",
                    "constituency",
                    "constituency_type",
                    "clean_answers",
                    "year",
                    "Q_Link",
                  ]}
                  hitComponents={[
                    {
                      key: "list",
                      title: "List",
                      listComponent: GetQuestionsTable,
                      defaultOption: true,
                    },
                  ]}
                  scrollTo="body"
                />

                <NoHits suggestionsField={"ministry"} />
                <InitialLoader />
                <Pagination showNumbers={true} />
              </LayoutResults>
            </LayoutBody>
          </Layout>
        </SearchkitProvider>
      </div>
    );
  }
}