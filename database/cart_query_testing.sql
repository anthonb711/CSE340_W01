/* Cart Model Testing QUERIES */

	-- GET ALL CART DATA
SELECT * FROM public.cart;

	-- GET CART BY INVENTORY ID
SELECT * 
FROM public.cart AS c
    JOIN public.inventory AS i
    ON c.inv_id = i.inv_id
WHERE i.inv_id = 8;

	-- GET CART BY ACCOUNT ID
SELECT * 
FROM public.cart AS c
	JOIN public.account AS a
    ON c.account_id = a.account_id
WHERE a.account_id = 16;

	-- GET TOTAL PRICE BY ACCOUNT ID
SELECT  SUM(total_price) AS total_sum
FROM public.cart
WHERE account_id = 17;

	
	--ADD INVENTORY TO CART
INSERT INTO public.cart ( account_id, inv_id, quantity, status, added_date, total_price) 
VALUES (17, 8, 1, default, default, 65000) 
RETURNING *;

	-- UPDATE INVENTORY CART STATUS
UPDATE public.cart 
SET status = 'inactive' 
WHERE inv_id = 2
RETURNING *

	-- REMOVE CART ENTITY
DELETE FROM public.cart WHERE inv_id = 2;

	-- DELETE USER CART
DELETE FROM public.cart WHERE account_id = 17;