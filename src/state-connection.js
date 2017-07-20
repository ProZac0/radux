import { connect as reduxConnect } from "react-redux";
import { bindActionCreators } from "redux";

import { BaseFilter, IncludeFilter, ExcludeFilter } from "./state-filters";
import { buildDispatchToPropsMap, buildStateToPropsMap } from "./radux";

export default class StateConnection {
  constructor(Component = null) {
    this.Component = Component;
    this.stateFilter = null;
    this.mergeProps = null;
    this.options = null;
    this.actionCreators = {};
  }

  setOptions(options) {
    this.options = { ...options };
    return this;
  }

  addActionCreators(actionCreators) {
    this.actionCreators = { ...this.actionCreators, actionCreators };
    return this;
  }

  setStateFilter(filter, type = null) {
    if (filter instanceof BaseFilter) {
      this.stateFilter = filter;
    } else if (type === "include") {
      this.stateFilter = new Include(filter);
    } else if (type === "exclude") {
      this.stateFilter = new ExcludeFilter(filter);
    } else {
      this.stateFilter = new BaseFilter(filter);
    }

    return this;
  }

  connectTo(Component) {
    return reduxConnect(
      buildStateToPropsMap(this.stateFilter),
      buildDispatchToPropsMap(this.actionCreators),
      this.mergeProps,
      this.options
    )(this.Component || Component);
  }
}