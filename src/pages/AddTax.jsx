import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import data from "../data/dummyData";
import "./AddTax.css";
import { AiOutlineSearch } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";

const AddTax = () => {
  const [categories, setCategories] = useState({});
  const [resData, setResData] = useState({});
  const [searchKey, setsearchKey] = useState("");
  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    if (!values.rate) errors.rate = 'Required';

    return errors;
  };

  useEffect(() => {
    setResData(data)
    setCategories(Object.keys(resData));
  }, []);

  const filter = () => {
    let result = {},
      key;
    const fromSearch = searchKey.toLowerCase();
    if (fromSearch === "") {
      return data;
    } else {
      for (key in data) {
        const newValue = data[key].filter((item) => {
          return item.toLowerCase().includes(fromSearch);
        });
        if (newValue.length > 0) {
          result[key] = newValue;
        }
      }
    }
    return result;
  };

  useEffect(() => {
    const res = filter();
    setResData({ ...res });
    setCategories(Object.keys(res));
  }, [searchKey]);

  const selectAll = (values, setValues) => {
    let k;
    const allCat = Object.keys(resData).map((item, index) => `${item}${index}`);
    let res1 = [];
    categories.forEach((k) => {
      res1 = [...res1, ...getSubCategory(k)];
    });
    setValues({ ...values, applicable_items: [...allCat, ...res1] });
  };

  const initialValues = {
    applicable_items: [],
    applied_to: "some",
    name: "",
    rate: 5,
  };
  const onSubmit = (values) => {
    alert(JSON.stringify(values, null, 4));
  };

  const getSubCategory = (category) => {
    return resData[category]?.map((item, index) => `${item}${index}`);
  };

  const renderItems = (values, setValues) => {
    return categories.map((category, index) => (
      <div key={category} className="categoryContainer">
        <div className="category">
          <Field
            type="checkbox"
            name="applicable_items"
            value={`${category}${index}`}
            onChange={(e) => {
              let checked = e.target.checked;
              let subCategory = getSubCategory(category);
              let applicable_items = checked
                ? [
                    ...values?.applicable_items,
                    ...subCategory,
                    `${category}${index}`,
                  ]
                : values?.applicable_items?.filter((ai) => {
                    return ![...subCategory, `${category}${index}`].includes(
                      ai
                    );
                  });

              setValues({
                ...values,
                applicable_items: [...applicable_items],
                applied_to: "some",
              });

              return checked;
            }}
          />
          <label htmlFor="applicable_itens">{category}</label>
        </div>
        {resData[category].map((item, i) => (
          <div className="subCategory">
            <Field
              type="checkbox"
              name="applicable_items"
              value={`${item}${i}`}
              onChange={(e) => {
                let checked = e.target.checked;
                let subCategory = getSubCategory(category);

                let applicable_items = checked
                  ? false
                    ? [
                        ...values?.applicable_items,
                        `${item}${i}`,
                        `${category}${index}`,
                      ]
                    : [...values?.applicable_items, `${item}${i}`]
                  : values?.applicable_items?.filter((ai) => {
                      return ![`${item}${i}`, `${category}${index}`].includes(
                        ai
                      );
                    });
                const parentCheck = subCategory.every((val) =>
                  applicable_items.includes(val)
                );
                setValues({
                  ...values,
                  applied_to: "some",
                  applicable_items: parentCheck
                    ? [...applicable_items, `${category}${index}`]
                    : [...applicable_items],
                  
                });

                return checked;
              }}
            />
            <label>{`${item}`}</label>
          </div>
        ))}
      </div>
    ));
  };
  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="title">Add Tax</h1>
        <Formik
          validate={validate}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ errors, values, touched, setValues, onBlur }) => (
            <Form className="form">
              <div className="inputContainer">
                <Field name="name" type="text" placeholder="Tax Name" className={errors.name ? "error": ""}/>
                <Field
                  name="rate"
                  type="number"
                  placeholder="Tax Rate"
                  className={errors.rate ? "rate error": "rate"}
                />
              </div>
              <div className="radioGroup">
                <div className="radioButton">
                  <Field
                    name="applied_to"
                    type="radio"
                    value="all"
                    onClick={() => {
                      selectAll(values, setValues);
                    }}
                  />
                  <MdCheckCircle className="icons hidden" />
                  <label htmlFor="applied_to">
                    Apply to all items in collection
                  </label>
                </div>
                <div className="radioButton">
                  <Field name="applied_to" type="radio" value="some" />
                  <MdCheckCircle className="icons hidden" />
                  <label htmlFor="applied_to">Apply to specific items</label>
                </div>
              </div>
              <hr />
              <div className="searchContainer">
                <input
                  type="search"
                  onChange={(e) => {
                    setValues({ ...values, applicable_items: [] });
                    setsearchKey(e.target.value);
                  }}
                />
                <AiOutlineSearch className="icon" />
              </div>
              <FieldArray name="applicable_items">
                <div className="fieldArrayContainer">
                  {categories?.length > 0 && renderItems(values, setValues)}
                  {categories?.length === 0 && (
                    <div className="noItem">No Items Found</div>
                  )}
                </div>
              </FieldArray>
              {categories?.length > 0 && (
                <div className="buttonContainer">
                  <button type="submit">
                    Apply tax to {values?.applicable_items?.length} item(s)
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
        {/* <form onSubmit={formik.onSubmit}>
            <div>
                <input
                type="number"
                name="rate"
                id="rate"
                placeholder="Tax Value"
                value={formik.values.rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
                <span>%</span>
            </div>
            </form>
            <div>
            <div>
                <input
                type="radio"
                name="applied_to"
                value="all"
                onChange={formik.handleChange}
                checked={formik.values.applied_to === "some"}
                />
                <label htmlFor="applied_to">Apply to all items in collection</label>
            </div>
            <div>
                <input
                type="radio"
                name="applied_to"
                value="some"
                onChange={formik.handleChange}
                checked={formik.values.applied_to === "some"}
                />
                <label htmlFor="applied_to">Apply to all items in collection</label>
            </div>
            </div>
            <div>
            <input
                type="search"
                name="SearchItem"
                id=""
                placeholder="Search Items"
            />
            </div> */}
      </div>
    </div>
  );
};

export default AddTax;
