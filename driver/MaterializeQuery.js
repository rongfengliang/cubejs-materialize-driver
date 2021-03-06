const { BaseQuery,ParamAllocator,UserError } = require('@cubejs-backend/schema-compiler');

const GRANULARITY_TO_INTERVAL = {
  day: 'day',
  week: 'week',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
  month: 'month',
  year: 'year'
};

class CrateDBParamAllocator extends ParamAllocator {
  paramPlaceHolder(paramIndex) {
    return `$${paramIndex + 1}`;
  }
}

module.exports =  class CrateDBQuery extends BaseQuery {
  newParamAllocator() {
    return new CrateDBParamAllocator();
  }

  convertTz(field) {
    return `(${field}::timestamptz AT TIME ZONE '${this.timezone}')`;
  }

  timeGroupedColumn(granularity, dimension) {
    return `date_trunc('${GRANULARITY_TO_INTERVAL[granularity]}', ${dimension})`;
  }

  hllInit(sql) {
    return `hll_add_agg(hll_hash_any(${sql}))`;
  }

  hllMerge(sql) {
    return `round(hll_cardinality(hll_union_agg(${sql})))`;
  }

  countDistinctApprox(sql) {
    return `round(hll_cardinality(hll_add_agg(hll_hash_any(${sql}))))`;
  }

  preAggregationTableName(cube, preAggregationName, skipSchema) {
    const name = super.preAggregationTableName(cube, preAggregationName, skipSchema);
    if (name.length > 64) {
      throw new UserError(`cratedb can not work with table names that longer than 64 symbols. Consider using the 'sqlAlias' attribute in your cube and in your pre-aggregation definition for ${name}.`);
    }
    return name;
  }
}
