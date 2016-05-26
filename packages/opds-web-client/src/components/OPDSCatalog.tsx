import * as React from "react";
import * as ReactDOM from "react-dom";
import Root, { RootProps } from "./Root";
import buildStore from "../store";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  headerTitle?: string;
  pageTitleTemplate: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  store?: Redux.Store;
}

export default class OPDSCatalog extends React.Component<OPDSCatalogProps, any> {
  store: Redux.Store;

  constructor(props) {
    super(props);
    this.store = this.props.store || buildStore();
  }

  render(): JSX.Element {
    return (
      <Root
        store={this.store}
        {...this.props} />
    );
  }
}