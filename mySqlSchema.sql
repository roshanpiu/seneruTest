CREATE TABLE USAddress(
    USAddressID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),    
    state VARCHAR(255),
    zip VARCHAR(255),
    PRIMARY KEY (USAddressID)
);

CREATE TABLE PurchaseOrder(
    PurchaseOrderID INT NOT NULL AUTO_INCREMENT,
    OrderDate DATE,
    ShipTo INT,
    BillTo INT,
    PRIMARY KEY (PurchaseOrderID),
    FOREIGN KEY (ShipTo) REFERENCES USAddress(USAddressID),
    FOREIGN KEY (BillTo) REFERENCES USAddress(USAddressID)
);
