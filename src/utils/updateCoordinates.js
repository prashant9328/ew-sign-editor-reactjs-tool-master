const removeCoordinate = (coordList, id) => {
  return coordList.filter((coord) => coord.eleId !== id);
};

const updateCoordinateMappingField = (coordList, id, e) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        mappingField: e,
        value: "",
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateIsRequired = (coordList, id, value) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        isRequired: value,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateUpdateFromSalesforceSettings = (coordList, id, value) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        updateFromSalesforce: value,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateEditable = (coordList, id, value) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        editable: value,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateWriteBackSettings = (coordList, id, value) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        writeBack: value,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateValue = (coordList, id, value) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        value: value,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateOptions = (coordList, id, options) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        options: options, //.join()
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateName = (coordList, id, name) => {
  return coordList.map((item) => {
    if (item.eleId === id) {
      return {
        ...item,
        name: name,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateSignatory = (
  coordList,
  id,
  signatoryId,
  signatoryIndex,
  bgColor
) => {
  return coordList.map((item, index) => {
    if (item.eleId === id) {
      return {
        ...item,
        signatory_id: signatoryId,
        user_index_id: signatoryIndex,
        bgColor: bgColor,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinateSize = (coordList, id, width, height) => {
  return coordList.map((item, index) => {
    if (item.eleId === id) {
      return {
        ...item,
        width: width,
        height: height,
      };
    } else {
      return item;
    }
  });
};

const updateCoordinatePosition = (coordList, id, x, y) => {
  return coordList.map((item, index) => {
    if (item.eleId === id) {
      return {
        ...item,
        x: x,
        y: y,
      };
    } else {
      return item;
    }
  });
};

export {
  updateCoordinateMappingField,
  removeCoordinate,
  updateCoordinateValue,
  updateCoordinateOptions,
  updateCoordinateIsRequired,
  updateCoordinateUpdateFromSalesforceSettings,
  updateCoordinateWriteBackSettings,
  updateCoordinateName,
  updateCoordinateEditable,
  updateCoordinateSignatory,
  updateCoordinateSize,
  updateCoordinatePosition,
};
