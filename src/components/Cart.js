import React,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import { fs,auth } from '../Config/Config';
import CartProducts from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import Modal from './Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


toast.configure();

const Cart = () => {

  //show modal state
  const[showModal,setShowModal]=useState(false);

  //trigger modal
  const triggerModal=()=>{
    setShowModal(true);
  }

  //hide modal
  const hideModal=()=>{
    setShowModal(false)

  }



    
  //getting current user function
  function GetCurrentUser(){
    const [user,setUser]=useState(null);
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('users').doc(user.uid).get().then(snapshot=>{
          setUser(snapshot.data().FullName);
        })
      }else{
        setUser(null);
      }
      })
    },[])
    return user;
  }

  const user=GetCurrentUser();

  //state of cart products

  const [cartProducts,setCartProducts]=useState([]);

  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
          const newCartProduct=snapshot.docs.map((doc)=>({
            ID:doc.id,
            ...doc.data(),

          }));
          setCartProducts(newCartProduct);
        })
      }
      else{
        console.log('user is not login ');
      }
    })
  },[])
// console.log(cartProducts);

//getting qty of products in a seperate array

const qty=cartProducts.map(cartProduct=>{
  return cartProduct.qty;
})

const reducerOfQty=(accumulator,currentValue)=>accumulator+currentValue;
const totalQty=qty.reduce(reducerOfQty,0);

//console.log(totalQty);

//getting price of Products

const price=cartProducts.map(cartProduct=>{
  return cartProduct.TotalProductPrice
})

const reducerofprice=(accumulator,currentValue)=>accumulator+currentValue;
const totalprice=price.reduce(reducerofprice,0)

//console.log(totalprice)

  //cart product increase

  let Product;

  const cartProductIncrease=(cartProduct)=>{
    //console.log(cartProduct)

    Product=cartProduct;
    Product.qty=Product.qty+1;
    Product.TotalProductPrice=Product.qty*Product.price;

    //update firestore collection
    auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('Cart '+ user.uid).doc(cartProduct.ID).update(Product).then(()=>{
          console.log('increment added');
        })
      }
      else{
        console.log('user is not logged in')
      }
    })
  }

  //cart product decreases
    const cartProductDecrease=(cartProduct)=>{
        Product=cartProduct;
        if(Product.qty>1){
          Product.qty=Product.qty-1;
          Product.TotalProductPrice=Product.qty*Product.price
          
          //upadte in db
          auth.onAuthStateChanged(user=>{
          if(user){
            fs.collection('Cart '+user.uid).doc(cartProduct.ID).update(Product).then(()=>{
              console.log('decrement');

            })
          }
          else{
            console.log('user is not logged')
            
          }
        })
        }
    }


    const [totalProducts, setTotalProducts]=useState(0);
    // getting cart products   
    useEffect(()=>{        
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                })
            }
        })       
    },[])

    //charging payment
    const navigate=useNavigate();
    const handleToken= async(token)=>{
     // console.log(token);
      const cart={name:'All Products',totalprice}
      const response= await axios.post('http://localhost:8080/checkout',{
        token,
        cart
      })
      console.log(response)
      let {status}=response.data;
      if(status==='success'){
        navigate('/');
        toast.success('Your order has been placed successfully',{
          position:'top-right',
          autoClose:5000,
          hideProgressBar:false,
          closeOnClick:true,
          pauseOnHover:false,
          draggable:false,
          progress:undefined,
        })

        const uid = auth.currentUser.uid;
              const carts = await fs.collection('Cart ' + uid).get();
              for(var snap of carts.docs){
                  fs.collection('Cart ' + uid).doc(snap.id).delete();
              }
      }
      else{
        alert('something went wrong');
      }
    }

    
  return (
    <>
    <Navbar user={user} totalProducts={totalProducts}/>
    <br/>
 
    {cartProducts.length>0 &&(
      <div className='container-fluid'>
        <h1 className='text-center'>Cart</h1>
        <div className='products-box'>
            <CartProducts cartProducts={cartProducts} 
            cartProductIncrease={cartProductIncrease} 
            cartProductDecrease={cartProductDecrease}/>
        </div>   

          <div className='summary-box'>
            <h5>Cart Summary</h5>
            <br/>
            <div>
              Total No. of products:<span>{totalQty}</span>
            </div>
            <div>
              Total Price to Pay:<span>${totalprice}</span>
            </div>
            <br/>
            <StripeCheckout
             stripeKey='pk_test_51KqWMnSJ29YICg82v5LASsRMvUpRnz6MioOrKFnDWTuzq2FBY01fxsvwNLwJ6KBsfBEHI15NtjDKKVzcB86gyEuq00x6rO4OBr'
             token={handleToken}
             billingAddress
             shippingAddress
             name='All Products'
             amount={totalprice *100}
            >
            </StripeCheckout>
            <h6 className='text-center' style={{margin:7+'px'}}>OR</h6>
            <button className='btn btn-secondary btn-md' onClick={()=>triggerModal()}>
              Cash on Delivery
            </button>
          </div>
      </div>
    )}

            {cartProducts.length < 1 && (
                <div className='container-fluid'>No products to show</div>
            ) }

            {showModal===true&&(
                <Modal totalprice={totalprice} totalQty={totalQty}
                    hideModal={hideModal}
                />
            )}   
    </>
  )
}

export default Cart;