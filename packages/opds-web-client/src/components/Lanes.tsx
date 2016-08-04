import * as React from "react";
import { Store } from "redux";
import { connect } from "react-redux";
import { adapter } from "../OPDSDataAdapter";
import DataFetcher from "../DataFetcher";
import ActionsCreator from "../actions";
import Lane from "./Lane";
import { CollectionData, LaneData } from "../interfaces";
import { subtleListStyle } from "./styles";

export interface LanesProps {
  url: string;
  lanes?: LaneData[];
  fetchCollection?: (url: string) => Promise<CollectionData>;
  clearCollection?: () => void;
  store?: Store<{ collection: CollectionData; }>;
  proxy?: string;
  hiddenBookIds?: string[];
  hideMoreLinks?: boolean;
}

export class Lanes extends React.Component<any, any> {
  render() {
    return (
      <ul aria-label="groups of books" style={subtleListStyle}>
      { this.props.lanes && this.props.lanes.map(lane =>
        <li key={lane.title}>
          <Lane
            lane={lane}
            collectionUrl={this.props.url}
            hideMoreLinks={this.props.hideMoreLinks}
            hiddenBookIds={this.props.hiddenBookIds}
            />
        </li>
      ) }
      </ul>
    );
  }

  componentWillMount() {
    if (this.props.fetchCollection && (!this.props.lanes || !this.props.lanes.length)) {
      this.props.fetchCollection(this.props.url);
    }
  }

  componentWillUnmount() {
    if (this.props.clearCollection) {
      this.props.clearCollection();
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    lanes: state.collection.data ? state.collection.data.lanes : []
  };
}

function mapDispatchToProps(dispatch) {
  let fetcher = new DataFetcher({ proxyUrl: "http://localhost:3000/proxy", adapter });
  let actions = new ActionsCreator(fetcher);

  return {
    fetchCollection: (url: string) => dispatch(actions.fetchCollection(url)),
    clearCollection: () => dispatch(actions.clearCollection())
  };
}

const ConnectedLanes = connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(Lanes);

export default ConnectedLanes;