/* eslint-disable react/prop-types */


const PageTitle = ({heading}) => {
    return (
        <div className="my-8">
                <h1 className="text-3xl font-semibold text-blue-700 capitalize">{heading}</h1>
            </div>
    );
};

export default PageTitle;