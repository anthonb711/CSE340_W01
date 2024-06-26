-- Insert the following new record into the account table
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password)
VALUES (
	'Tony',
	'Stark',
 	'tony@starkent.com',
 	'Iam1ronM@n');

-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE 
   public.account
SET 
   account_type = 'Admin'
WHERE 
   account_id = 1;

--Delete the Tony Stark record from the database.
DELETE 
   FROM 
      public.account
   WHERE 
      account_id = 1;

--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE
	public.inventory
SET
	inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');

--Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT
	inv_make, inv_model, public.classification.classification_name
FROM
	public.inventory
JOIN
	public.classification
	ON public.inventory.classification_id = public.classification.classification_id
WHERE
	public.inventory.classification_id = 2;

--Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
UPDATE
	public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');