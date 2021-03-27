import React from "react";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
//import ReactFC from "../lib/ReactFC";
import ReactFC from "react-fusioncharts";
ReactFC.fcRoot(FusionCharts, TimeSeries);

const jsonify = (res) => res.json();
const dataFetch = fetch(
  "https://my-json-server.typicode.com/anshudesai1299/xyz/users.json"
).then(jsonify);
const schemaFetch = fetch(
  "https://my-json-server.typicode.com/anshudesai1299/abc/schema"
).then(jsonify);

const dataSource = {
  chart: {
    multicanvas: false
  },
  caption: {
    text: "Sales Analysis"
  },
  subcaption: {
    text: "Grocery & Footwear"
  },
  //series: "Type",
  yaxis: [
    {
      plot: "AvgSpeed",
      title: "Sale Value",
      format: {
        prefix: "$"
      }
    },
    {
      plot: "FuelCons",
      title: "Sale Value",
      format: {
        prefix: "$"
      }
    }
  ]
};

export default class ChartViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.state = {
      timeseriesDs: {
        type: "timeseries",
        renderAt: "container",
        width: "600",
        height: "400",
        dataSource
      }
    };
  }

  componentDidMount() {
    this.onFetchData();
  }

  onFetchData() {
    Promise.all([dataFetch, schemaFetch]).then((res) => {
      const data = res[0];
      const schema = res[1];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      timeseriesDs.dataSource.data = fusionTable;
      this.setState({
        timeseriesDs
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.timeseriesDs.dataSource.data ? (
          <ReactFC {...this.state.timeseriesDs} />
        ) : (
          "loading"
        )}
      </div>
    );
  }
}
