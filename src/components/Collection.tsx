import * as React from "react";
import Book from "./Book";
import CollectionLink from "./CollectionLink";
import Lane from "./Lane";
import FacetGroup from "./FacetGroup";
import Search from "./Search";

export default class Collection extends React.Component<CollectionProps, any> {
  render(): JSX.Element {
    let padding = 10;
    let headerHeight = 70;
    let navHeight = this.props.history && this.props.history.length ? 50 : 0;
    let leftPanelWidth = 190;

    let collectionTopStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0"
    };

    let navStyle = {
      height: `${navHeight}px`,
      position: "fixed",
      top: `${headerHeight + padding}px`,
      width: "100%",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee"
    };

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      paddingTop: `${headerHeight + navHeight + padding}px`,
      height: "100%",
      marginTop: `${padding + 5}px`
    };

    if (this.props.collection.facetGroups && this.props.collection.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      marginTop: `${headerHeight + navHeight + padding}px`,
      width: `${leftPanelWidth}px`,
      position: "fixed",
      left: "0"
    };

    let linkStyle = {
      textAlign: "center",
      backgroundColor: "#ddd",
      margin: "25px",
      padding: "10px",
      overflow: "hidden",
      fontSize: "500%",
      display: "block"
    };

    let loadingNextPageStyle = {
      clear: "both",
      height: "50px",
      textAlign: "center"
    };

    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="collectionTop" style={collectionTopStyle}>
          { this.props.collection.search &&
            <div style={{ float: "right", marginRight: "20px" }}>
              <Search
                url={this.props.collection.search.url}
                searchData={this.props.collection.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                setCollection={this.props.setCollection} />
            </div>
          }
          <h1 className="collectionTitle">{this.props.collection.title}</h1>
        </div>

        { this.props.history && this.props.history.length ?
          <nav role="navigation" style={ navStyle }><ul>
            { this.props.history.map(breadcrumb =>
              <li style={{ listStyle: "none", float: "left", marginRight: "5px" }} key={breadcrumb.id}>
                <CollectionLink
                  text={breadcrumb.text}
                  url={breadcrumb.url}
                  setCollection={this.props.setCollection}
                  style={{ fontSize: "1.2em", marginRight: "5px", cursor: "pointer" }} />
                ›
              </li>
            )}
            <li className="currentCollection" style={{ listStyle: "none", float: "left", fontSize: "1.2em" }}>{this.props.collection.title}</li>
          </ul></nav> :
          null
        }

        {this.props.collection.facetGroups && this.props.collection.facetGroups.length && (
          <div className="facetGroups" style={leftPanelStyle}>
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup key={facetGroup.label} facetGroup={facetGroup} setCollection={this.props.setCollection} />
            )}
          </div>
        )}

        <div className="collectionBody" style={collectionBodyStyle}>

          { this.props.collection.lanes && this.props.collection.lanes.map(lane =>
              <Lane
                key={lane.title}
                lane={lane}
                setCollection={this.props.setCollection}
                setBook={this.props.setBook}
                collectionUrl={this.props.collection.url} />
          ) }

          { this.props.collection.books && this.props.collection.books.map(book =>
              <Book
                key={book.id}
                book={book}
                setBook={this.props.setBook}
                collectionUrl={this.props.collection.url} />
          ) }

          { this.props.collection.links &&
            <ul style={{ padding: 0, listStyleType: "none" }}>
            { this.props.collection.links.map(link =>
              <li key={link.id}>
                <CollectionLink
                  text={link.text}
                  url={link.url}
                  setCollection={this.props.setCollection}
                  style={linkStyle} />
              </li>) }
            </ul>
          }

          { this.props.isFetchingPage && <div className="loadingNextPage" style={loadingNextPageStyle}>Loading next page...</div> }
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching && !nextProps.error) {
       document.body.scrollTop = 0;
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    let atBottom = ((document.body.scrollTop + window.innerHeight) >= document.body.scrollHeight);
    if (atBottom && !this.props.isFetchingPage && this.props.collection.nextPageUrl) {
      this.props.fetchPage(this.props.collection.nextPageUrl);
    }
  }
}